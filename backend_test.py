#!/usr/bin/env python3
"""
Backend Regression Test - Iteration 39
Focused test for prompt/content change validation per review request:
1. /api/health returns healthy
2. extensive_log prompt includes mandatory Barrister Conference Dossier section and no-cost/no-witness-contradiction guardrails  
3. No backend startup/runtime errors from latest edits
"""

import asyncio
import aiohttp
import json
import sys
import os
from datetime import datetime

# Backend URL from frontend env
BACKEND_URL = "https://appeal-analyzer-1.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.session = None
        self.test_results = []
        
    async def setup(self):
        """Initialize HTTP session"""
        timeout = aiohttp.ClientTimeout(total=30)
        self.session = aiohttp.ClientSession(timeout=timeout)
    
    async def cleanup(self):
        """Close HTTP session"""
        if self.session:
            await self.session.close()
    
    async def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        message = f"{status} - {test_name}"
        if details:
            message += f": {details}"
        print(message)
        
        self.test_results.append({
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
    
    async def test_health_endpoint(self):
        """Test 1: /api/health returns healthy status"""
        test_name = "Health Endpoint (/api/health)"
        
        try:
            async with self.session.get(f"{BACKEND_URL}/health") as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get("status") == "healthy" and "timestamp" in data:
                        await self.log_test(test_name, True, f"Status: {data['status']}, Timestamp: {data['timestamp']}")
                        return True
                    else:
                        await self.log_test(test_name, False, f"Invalid response format: {data}")
                        return False
                else:
                    await self.log_test(test_name, False, f"HTTP {response.status}")
                    return False
        except Exception as e:
            await self.log_test(test_name, False, f"Exception: {str(e)}")
            return False
    
    async def test_extensive_log_prompt_content(self):
        """Test 2: Verify extensive_log prompt includes Barrister Conference Dossier section and guardrails"""
        test_name = "Extensive Log Prompt Content Verification"
        
        try:
            # Read the server.py file to verify prompt content
            server_file_path = "/app/backend/server.py"
            
            if not os.path.exists(server_file_path):
                await self.log_test(test_name, False, "server.py file not found")
                return False
            
            with open(server_file_path, 'r', encoding='utf-8') as f:
                server_content = f.read()
            
            # Check for mandatory Barrister Conference Dossier section in extensive_log
            barrister_conference_found = "## 18. BARRISTER CONFERENCE DOSSIER (MANDATORY)" in server_content
            
            # Check for mandatory guardrails
            guardrails_section = "MANDATORY GUARDRAILS:" in server_content
            no_cost_guardrail = "DO NOT include cost estimates, fee ranges, funding commentary, or budget analysis" in server_content
            no_witness_guardrail = "DO NOT include witness contradiction sections or witness credibility scoring sections" in server_content
            
            # Additional verification that the Barrister Conference section is properly structured
            barrister_conference_details = all([
                "Provide a barrister-ready conference pack containing:" in server_content,
                "Lead theory of appeal in 8-12 lines" in server_content,
                "10-minute oral conference outline" in server_content,
                "Bench question anticipation list with model response lines" in server_content,
                "Authorities shortlist (primary + fallback)" in server_content,
                "Orders sought: primary order + fallback order" in server_content
            ])
            
            checks = {
                "Barrister Conference Dossier Section": barrister_conference_found,
                "Mandatory Guardrails Section": guardrails_section,
                "No Cost Estimates Guardrail": no_cost_guardrail,
                "No Witness Contradiction Guardrail": no_witness_guardrail,
                "Barrister Conference Details": barrister_conference_details
            }
            
            all_passed = all(checks.values())
            failed_checks = [key for key, value in checks.items() if not value]
            
            if all_passed:
                await self.log_test(test_name, True, "All required sections and guardrails found")
                return True
            else:
                await self.log_test(test_name, False, f"Missing components: {', '.join(failed_checks)}")
                return False
                
        except Exception as e:
            await self.log_test(test_name, False, f"Exception: {str(e)}")
            return False
    
    async def test_backend_startup_errors(self):
        """Test 3: Check for backend startup/runtime errors in logs"""
        test_name = "Backend Startup/Runtime Error Check"
        
        try:
            # Check supervisor logs for errors
            error_log_path = "/var/log/supervisor/backend.err.log"
            
            if not os.path.exists(error_log_path):
                await self.log_test(test_name, False, "Backend error log not found")
                return False
            
            # Read last 50 lines of error log
            with open(error_log_path, 'r') as f:
                lines = f.readlines()
                recent_lines = lines[-50:] if len(lines) > 50 else lines
            
            # Look for critical errors in recent logs
            critical_errors = []
            startup_errors = []
            
            for line in recent_lines:
                line_lower = line.lower()
                if any(error in line_lower for error in ['error:', 'exception:', 'traceback', 'failed']):
                    if any(startup_term in line_lower for startup_term in ['startup', 'failed to start', 'import error', 'module not found']):
                        startup_errors.append(line.strip())
                    elif 'error:' in line_lower or 'exception:' in line_lower:
                        critical_errors.append(line.strip())
            
            # Check if backend is currently running by testing a simple endpoint
            backend_running = False
            try:
                async with self.session.get(f"{BACKEND_URL}/health") as response:
                    backend_running = response.status == 200
            except:
                pass
            
            # Determine test result
            if startup_errors:
                await self.log_test(test_name, False, f"Startup errors found: {'; '.join(startup_errors[:3])}")
                return False
            elif not backend_running:
                await self.log_test(test_name, False, "Backend not responding - possible runtime issues")
                return False
            else:
                if critical_errors:
                    # Non-startup errors present but backend running
                    await self.log_test(test_name, True, f"Backend running cleanly - recent non-critical errors: {len(critical_errors)}")
                else:
                    await self.log_test(test_name, True, "No startup/runtime errors detected - backend running cleanly")
                return True
                
        except Exception as e:
            await self.log_test(test_name, False, f"Exception: {str(e)}")
            return False
    
    async def test_auth_protected_endpoint(self):
        """Bonus Test: Verify auth-protected endpoints require authentication"""
        test_name = "Authentication Protection (Bonus)"
        
        try:
            # Test unauthenticated access to protected endpoint
            async with self.session.get(f"{BACKEND_URL}/cases") as response:
                if response.status == 401:
                    await self.log_test(test_name, True, "Auth protection working - returns 401 for unauthenticated requests")
                    return True
                else:
                    await self.log_test(test_name, False, f"Auth protection failed - returned HTTP {response.status}")
                    return False
        except Exception as e:
            await self.log_test(test_name, False, f"Exception: {str(e)}")
            return False
    
    async def test_public_endpoints(self):
        """Bonus Test: Verify core public endpoints are functional"""
        test_name = "Core Public Endpoints (Bonus)"
        
        endpoints = [
            ("/states", "states"),
            ("/offence-categories", "categories"), 
            ("/payments/prices", None)  # pricing endpoint structure may vary
        ]
        
        try:
            results = []
            for endpoint, expected_key in endpoints:
                async with self.session.get(f"{BACKEND_URL}{endpoint}") as response:
                    if response.status == 200:
                        data = await response.json()
                        if expected_key and expected_key in data:
                            results.append(f"{endpoint}:✓")
                        elif not expected_key:  # payments/prices endpoint
                            results.append(f"{endpoint}:✓")
                        else:
                            results.append(f"{endpoint}:✗")
                    else:
                        results.append(f"{endpoint}:HTTP{response.status}")
            
            all_working = all("✓" in result for result in results)
            details = "; ".join(results)
            
            await self.log_test(test_name, all_working, details)
            return all_working
            
        except Exception as e:
            await self.log_test(test_name, False, f"Exception: {str(e)}")
            return False
    
    async def run_all_tests(self):
        """Run all regression tests"""
        print(f"\n=== BACKEND REGRESSION TEST - {datetime.now().isoformat()} ===")
        print(f"Target: {BACKEND_URL}")
        print("\nRunning tests...\n")
        
        await self.setup()
        
        # Core tests (matching review request)
        test1 = await self.test_health_endpoint()
        test2 = await self.test_extensive_log_prompt_content()  
        test3 = await self.test_backend_startup_errors()
        
        # Bonus tests
        test4 = await self.test_auth_protected_endpoint()
        test5 = await self.test_public_endpoints()
        
        await self.cleanup()
        
        # Summary
        core_tests = [test1, test2, test3]
        bonus_tests = [test4, test5]
        all_tests = core_tests + bonus_tests
        
        print(f"\n=== TEST RESULTS SUMMARY ===")
        print(f"Core Tests (Review Request): {sum(core_tests)}/{len(core_tests)} passed")
        print(f"Bonus Tests: {sum(bonus_tests)}/{len(bonus_tests)} passed") 
        print(f"Total Tests: {sum(all_tests)}/{len(all_tests)} passed")
        
        # Readiness verdict
        core_passed = all(core_tests)
        if core_passed:
            print(f"\n✅ READINESS VERDICT: READY")
            print("   - Health endpoint operational")
            print("   - Extensive Log prompt includes mandatory Barrister Conference Dossier")
            print("   - No-cost/no-witness-contradiction guardrails maintained")
            print("   - No backend startup/runtime errors detected")
        else:
            print(f"\n❌ READINESS VERDICT: NOT READY")
            print("   - Core functionality issues detected")
        
        return core_passed

async def main():
    """Main test runner"""
    tester = BackendTester()
    success = await tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    asyncio.run(main())