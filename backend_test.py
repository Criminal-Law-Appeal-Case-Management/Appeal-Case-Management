#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Justitia AI - Criminal Appeal Case Management
Tests all CRUD operations, authentication, and AI report generation
"""

import requests
import sys
import json
import time
from datetime import datetime
from io import BytesIO

class JustitiaAPITester:
    def __init__(self, base_url="https://lawbrief-sorter.preview.emergentagent.com"):
        self.base_url = base_url
        self.session_token = "test_session_notes_1770882054339"  # Updated test session
        self.user_id = "test-user-notes-1770882054339"
        self.tests_run = 0
        self.tests_passed = 0
        self.case_id = "case_64f57656cd75"  # Use existing test case
        self.document_id = None
        self.event_id = None
        self.report_id = None
        self.note_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.session_token:
            headers['Authorization'] = f'Bearer {self.session_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if files:
                # Remove Content-Type for file uploads
                headers.pop('Content-Type', None)
                
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    response = requests.post(url, files=files, data=data, headers=headers)
                else:
                    response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test basic health endpoints"""
        print("\n" + "="*50)
        print("TESTING HEALTH & BASIC ENDPOINTS")
        print("="*50)
        
        self.run_test("Root endpoint", "GET", "", 200)
        self.run_test("Health check", "GET", "health", 200)

    def test_authentication(self):
        """Test authentication endpoints"""
        print("\n" + "="*50)
        print("TESTING AUTHENTICATION")
        print("="*50)
        
        success, user_data = self.run_test("Get current user", "GET", "auth/me", 200)
        if success and user_data:
            print(f"   User: {user_data.get('name')} ({user_data.get('email')})")
            return True
        return False

    def test_case_management(self):
        """Test case CRUD operations"""
        print("\n" + "="*50)
        print("TESTING CASE MANAGEMENT")
        print("="*50)
        
        # Get initial cases
        self.run_test("Get all cases (initial)", "GET", "cases", 200)
        
        # Create a new case
        case_data = {
            "title": "R v Smith - Murder Appeal Test Case",
            "defendant_name": "John Smith",
            "case_number": "2024/TEST001",
            "court": "NSW Supreme Court",
            "judge": "Justice Test",
            "summary": "Test case for criminal appeal management system"
        }
        
        success, response = self.run_test("Create new case", "POST", "cases", 200, case_data)
        if success and response:
            self.case_id = response.get('case_id')
            print(f"   Created case ID: {self.case_id}")
        
        if not self.case_id:
            print("❌ Cannot continue without case ID")
            return False
            
        # Get specific case
        self.run_test("Get specific case", "GET", f"cases/{self.case_id}", 200)
        
        # Update case
        update_data = {
            "title": "R v Smith - Murder Appeal Test Case (Updated)",
            "defendant_name": "John Smith",
            "case_number": "2024/TEST001",
            "court": "NSW Supreme Court",
            "judge": "Justice Test Updated",
            "summary": "Updated test case summary"
        }
        self.run_test("Update case", "PUT", f"cases/{self.case_id}", 200, update_data)
        
        # Get updated cases list
        self.run_test("Get all cases (after create)", "GET", "cases", 200)
        
        return True

    def test_document_management(self):
        """Test document upload and management"""
        print("\n" + "="*50)
        print("TESTING DOCUMENT MANAGEMENT")
        print("="*50)
        
        if not self.case_id:
            print("❌ No case ID available for document testing")
            return False
            
        # Get initial documents
        self.run_test("Get case documents (initial)", "GET", f"cases/{self.case_id}/documents", 200)
        
        # Create a test file
        test_content = "This is a test legal brief document for the criminal appeal case."
        test_file = BytesIO(test_content.encode('utf-8'))
        
        # Upload document
        files = {'file': ('test_brief.txt', test_file, 'text/plain')}
        form_data = {
            'category': 'brief',
            'description': 'Test legal brief document'
        }
        
        success, response = self.run_test(
            "Upload document", 
            "POST", 
            f"cases/{self.case_id}/documents", 
            200, 
            data=form_data, 
            files=files
        )
        
        if success and response:
            self.document_id = response.get('document_id')
            print(f"   Uploaded document ID: {self.document_id}")
        
        # Get documents after upload
        self.run_test("Get case documents (after upload)", "GET", f"cases/{self.case_id}/documents", 200)
        
        if self.document_id:
            # Get specific document
            self.run_test("Get specific document", "GET", f"cases/{self.case_id}/documents/{self.document_id}", 200)
        
        return True

    def test_timeline_management(self):
        """Test timeline event management"""
        print("\n" + "="*50)
        print("TESTING TIMELINE MANAGEMENT")
        print("="*50)
        
        if not self.case_id:
            print("❌ No case ID available for timeline testing")
            return False
            
        # Get initial timeline
        self.run_test("Get case timeline (initial)", "GET", f"cases/{self.case_id}/timeline", 200)
        
        # Create timeline event
        event_data = {
            "title": "Initial Arrest",
            "description": "Defendant was arrested on suspicion of murder",
            "event_date": "2024-01-15T10:30:00Z",
            "event_type": "arrest"
        }
        
        success, response = self.run_test("Create timeline event", "POST", f"cases/{self.case_id}/timeline", 200, event_data)
        if success and response:
            self.event_id = response.get('event_id')
            print(f"   Created event ID: {self.event_id}")
        
        # Get timeline after creation
        self.run_test("Get case timeline (after create)", "GET", f"cases/{self.case_id}/timeline", 200)
        
        if self.event_id:
            # Update timeline event
            update_event_data = {
                "title": "Initial Arrest (Updated)",
                "description": "Defendant was arrested on suspicion of murder - updated details",
                "event_date": "2024-01-15T10:30:00Z",
                "event_type": "arrest"
            }
            self.run_test("Update timeline event", "PUT", f"cases/{self.case_id}/timeline/{self.event_id}", 200, update_event_data)
        
        return True

    def test_ai_report_generation(self):
        """Test AI-powered report generation"""
        print("\n" + "="*50)
        print("TESTING AI REPORT GENERATION")
        print("="*50)
        
        if not self.case_id:
            print("❌ No case ID available for report testing")
            return False
            
        # Get initial reports
        self.run_test("Get case reports (initial)", "GET", f"cases/{self.case_id}/reports", 200)
        
        # Generate Quick Summary report
        print("   Generating Quick Summary report (this may take 10-15 seconds)...")
        report_data = {"report_type": "quick_summary"}
        
        success, response = self.run_test("Generate Quick Summary report", "POST", f"cases/{self.case_id}/reports/generate", 200, report_data)
        if success and response:
            self.report_id = response.get('report_id')
            print(f"   Generated report ID: {self.report_id}")
            print(f"   Report title: {response.get('title')}")
        
        # Get reports after generation
        self.run_test("Get case reports (after generate)", "GET", f"cases/{self.case_id}/reports", 200)
        
        if self.report_id:
            # Get specific report
            self.run_test("Get specific report", "GET", f"cases/{self.case_id}/reports/{self.report_id}", 200)
        
        return True

    def test_cleanup_operations(self):
        """Test delete operations"""
        print("\n" + "="*50)
        print("TESTING CLEANUP OPERATIONS")
        print("="*50)
        
        # Delete report
        if self.report_id:
            self.run_test("Delete report", "DELETE", f"cases/{self.case_id}/reports/{self.report_id}", 200)
        
        # Delete document
        if self.document_id:
            self.run_test("Delete document", "DELETE", f"cases/{self.case_id}/documents/{self.document_id}", 200)
        
        # Delete timeline event
        if self.event_id:
            self.run_test("Delete timeline event", "DELETE", f"cases/{self.case_id}/timeline/{self.event_id}", 200)
        
        # Delete case (this will delete all related data)
        if self.case_id:
            self.run_test("Delete case", "DELETE", f"cases/{self.case_id}", 200)

    def test_error_handling(self):
        """Test error handling for invalid requests"""
        print("\n" + "="*50)
        print("TESTING ERROR HANDLING")
        print("="*50)
        
        # Test invalid case ID
        self.run_test("Get non-existent case", "GET", "cases/invalid-case-id", 404)
        
        # Test invalid report generation
        invalid_report_data = {"report_type": "invalid_type"}
        self.run_test("Generate invalid report type", "POST", f"cases/invalid-case/reports/generate", 404, invalid_report_data)
        
        # Test unauthorized access (without token)
        old_token = self.session_token
        self.session_token = None
        self.run_test("Unauthorized access", "GET", "cases", 401)
        self.session_token = old_token

def main():
    print("🏛️  JUSTITIA AI - CRIMINAL APPEAL CASE MANAGEMENT API TESTING")
    print("=" * 70)
    print(f"Backend URL: https://lawbrief-sorter.preview.emergentagent.com")
    print(f"Test User: test-user-1770881377244")
    print(f"Session Token: test_session_1770881377244")
    print("=" * 70)
    
    tester = JustitiaAPITester()
    
    # Run all test suites
    try:
        tester.test_health_check()
        
        if not tester.test_authentication():
            print("\n❌ Authentication failed - stopping tests")
            return 1
            
        tester.test_case_management()
        tester.test_document_management()
        tester.test_timeline_management()
        tester.test_ai_report_generation()
        tester.test_error_handling()
        tester.test_cleanup_operations()
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {str(e)}")
        return 1
    
    # Print final results
    print("\n" + "="*70)
    print("📊 FINAL TEST RESULTS")
    print("="*70)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {tester.tests_run - tester.tests_passed} TESTS FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())