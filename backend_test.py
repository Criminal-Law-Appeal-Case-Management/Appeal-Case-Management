#!/usr/bin/env python3
"""
Backend Regression Test Suite
Tests for Appeal Analyzer backend API functionality and recent report guardrails updates
"""

import requests
import json
import time
from datetime import datetime

# Test Configuration
BASE_URL = "https://appeal-analyzer-1.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

class BackendRegressionTest:
    def __init__(self):
        self.results = []
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'Backend-Test-Suite/1.0'
        })
    
    def log_result(self, test_name: str, status: str, message: str, details: dict = None):
        """Log test result"""
        result = {
            'test': test_name,
            'status': status,  # PASS, FAIL, ERROR
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details or {}
        }
        self.results.append(result)
        print(f"[{status}] {test_name}: {message}")
        if details:
            print(f"    Details: {json.dumps(details, indent=2)}")
    
    def test_health_endpoint(self):
        """Test 1: Validate health endpoint availability via /api/health"""
        try:
            # Test API health endpoint - this is the main backend health check
            api_response = self.session.get(f"{API_BASE}/health", timeout=30)
            if api_response.status_code == 200:
                try:
                    api_data = api_response.json()
                    if api_data.get('status') == 'healthy':
                        self.log_result("Health Endpoint (/api/health)", "PASS", 
                                      "API health endpoint responding correctly",
                                      {"status_code": api_response.status_code, "response": api_data})
                    else:
                        self.log_result("Health Endpoint (/api/health)", "FAIL", 
                                      "API health endpoint returned unexpected status",
                                      {"status_code": api_response.status_code, "response": api_data})
                except json.JSONDecodeError:
                    self.log_result("Health Endpoint (/api/health)", "FAIL", 
                                  "API health endpoint returned invalid JSON",
                                  {"status_code": api_response.status_code, "response": api_response.text[:200]})
            else:
                self.log_result("Health Endpoint (/api/health)", "FAIL", 
                              f"API health endpoint returned {api_response.status_code}",
                              {"status_code": api_response.status_code, "response": api_response.text[:200]})
        
        except Exception as e:
            self.log_result("Health Endpoint", "ERROR", f"Failed to test health endpoint: {str(e)}")
    
    def test_auth_protected_report_endpoint(self):
        """Test 2: Validate auth-protected report endpoint rejects unauthenticated requests"""
        try:
            # Test without authentication
            test_case_id = "test_case_123"
            report_data = {"report_type": "quick_summary"}
            
            response = self.session.post(
                f"{API_BASE}/cases/{test_case_id}/reports/generate", 
                json=report_data,
                timeout=30
            )
            
            if response.status_code == 401:
                self.log_result("Auth Protection - Report Generation", "PASS", 
                              "Report endpoint correctly rejects unauthenticated requests",
                              {"status_code": response.status_code, "endpoint": f"/cases/{test_case_id}/reports/generate"})
            elif response.status_code in [403, 422]:
                # These are also acceptable auth rejection codes
                self.log_result("Auth Protection - Report Generation", "PASS", 
                              f"Report endpoint correctly rejects unauthenticated requests with {response.status_code}",
                              {"status_code": response.status_code, "response": response.text[:500]})
            else:
                try:
                    error_data = response.json()
                    self.log_result("Auth Protection - Report Generation", "FAIL", 
                                  f"Report endpoint did not properly reject unauthenticated request (got {response.status_code})",
                                  {"status_code": response.status_code, "response": error_data})
                except:
                    self.log_result("Auth Protection - Report Generation", "FAIL", 
                                  f"Report endpoint did not properly reject unauthenticated request (got {response.status_code})",
                                  {"status_code": response.status_code, "response": response.text[:500]})
        
        except Exception as e:
            self.log_result("Auth Protection - Report Generation", "ERROR", 
                          f"Failed to test auth protection: {str(e)}")
    
    def test_public_endpoints_availability(self):
        """Test 4: Ensure no breaking changes for core public endpoints"""
        public_endpoints = [
            ("/states", "Australian States"),
            ("/offence-categories", "Offence Categories"),
            ("/payments/prices", "Payment Prices")
        ]
        
        for endpoint, description in public_endpoints:
            try:
                response = self.session.get(f"{API_BASE}{endpoint}", timeout=30)
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if endpoint == "/states" and "states" in data:
                            self.log_result(f"Public Endpoint - {description}", "PASS", 
                                          f"Endpoint {endpoint} working correctly",
                                          {"status_code": response.status_code, "data_keys": list(data.keys())})
                        elif endpoint == "/offence-categories" and "categories" in data:
                            self.log_result(f"Public Endpoint - {description}", "PASS", 
                                          f"Endpoint {endpoint} working correctly",
                                          {"status_code": response.status_code, "data_keys": list(data.keys())})
                        elif endpoint == "/payments/prices":
                            self.log_result(f"Public Endpoint - {description}", "PASS", 
                                          f"Endpoint {endpoint} working correctly",
                                          {"status_code": response.status_code, "price_keys": list(data.keys())})
                        else:
                            self.log_result(f"Public Endpoint - {description}", "PASS", 
                                          f"Endpoint {endpoint} responding with valid JSON",
                                          {"status_code": response.status_code, "response_type": type(data).__name__})
                    except json.JSONDecodeError:
                        self.log_result(f"Public Endpoint - {description}", "FAIL", 
                                      f"Endpoint {endpoint} returned invalid JSON",
                                      {"status_code": response.status_code, "response": response.text[:200]})
                else:
                    self.log_result(f"Public Endpoint - {description}", "FAIL", 
                                  f"Endpoint {endpoint} returned {response.status_code}",
                                  {"status_code": response.status_code, "response": response.text[:200]})
            
            except Exception as e:
                self.log_result(f"Public Endpoint - {description}", "ERROR", 
                              f"Failed to test endpoint {endpoint}: {str(e)}")
    
    def test_report_guardrails_code_level(self):
        """Test 3: Code-level verification of report prompt guardrails"""
        try:
            # Read the server.py file to verify guardrails are in place
            with open('/app/backend/server.py', 'r') as f:
                content = f.read()
            
            # Check for exclusion of costs and witness contradiction sections
            cost_exclusion = "DO NOT include cost estimates" in content
            witness_exclusion = "DO NOT include witness contradiction sections" in content or "witness credibility" in content
            
            guardrails_section = "MANDATORY GUARDRAILS" in content
            
            findings = {
                "cost_exclusion_found": cost_exclusion,
                "witness_exclusion_found": witness_exclusion,
                "guardrails_section_found": guardrails_section
            }
            
            if cost_exclusion and witness_exclusion and guardrails_section:
                self.log_result("Report Guardrails - Code Level", "PASS", 
                              "Updated report prompt guardrails correctly exclude costs and witness contradiction sections",
                              findings)
            else:
                self.log_result("Report Guardrails - Code Level", "FAIL", 
                              "Report guardrails may not be properly implemented",
                              findings)
            
            # Additional check for specific guardrail text
            if "DO NOT include cost estimates, fee ranges, funding commentary, or budget analysis" in content:
                self.log_result("Cost Exclusion Guardrail", "PASS", 
                              "Specific cost exclusion guardrail found in code")
            
            if "DO NOT include witness contradiction sections or witness credibility scoring sections" in content:
                self.log_result("Witness Contradiction Exclusion", "PASS", 
                              "Specific witness contradiction exclusion guardrail found in code")
        
        except Exception as e:
            self.log_result("Report Guardrails - Code Level", "ERROR", 
                          f"Failed to verify code-level guardrails: {str(e)}")
    
    def run_all_tests(self):
        """Run all regression tests"""
        print("=" * 80)
        print("BACKEND REGRESSION TEST SUITE")
        print(f"Target: {BASE_URL}")
        print(f"Started: {datetime.now().isoformat()}")
        print("=" * 80)
        
        # Run tests
        self.test_health_endpoint()
        self.test_auth_protected_report_endpoint()
        self.test_report_guardrails_code_level()
        self.test_public_endpoints_availability()
        
        # Summary
        print("\n" + "=" * 80)
        print("TEST RESULTS SUMMARY")
        print("=" * 80)
        
        passed = len([r for r in self.results if r['status'] == 'PASS'])
        failed = len([r for r in self.results if r['status'] == 'FAIL'])
        errors = len([r for r in self.results if r['status'] == 'ERROR'])
        total = len(self.results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Errors: {errors}")
        
        if failed > 0 or errors > 0:
            print("\nFAILED/ERROR TESTS:")
            for result in self.results:
                if result['status'] in ['FAIL', 'ERROR']:
                    print(f"  - {result['test']}: {result['message']}")
        
        return {
            'total': total,
            'passed': passed,
            'failed': failed,
            'errors': errors,
            'results': self.results
        }


if __name__ == "__main__":
    tester = BackendRegressionTest()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    if results['failed'] > 0 or results['errors'] > 0:
        exit(1)
    else:
        exit(0)