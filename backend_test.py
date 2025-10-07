#!/usr/bin/env python3
"""
VetMed Pro Backend Testing Suite
Comprehensive tests for veterinary consultation platform
"""

import asyncio
import aiohttp
import json
import uuid
from datetime import datetime
import sys
import os

# Test configuration
BASE_URL = "https://vetmedpro.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

# Test data for Mexican veterinary professionals
TEST_VET_DATA = {
    "nombre": "Dr. María Elena Rodríguez Hernández",
    "email": f"maria.rodriguez.{uuid.uuid4().hex[:8]}@veterinaria.mx",
    "telefono": "+52 55 1234 5678",
    "cedula_profesional": "12345678",  # Valid format for Mexican veterinary license
    "especialidad": "Medicina Interna de Pequeñas Especies",
    "años_experiencia": 8,
    "institucion": "Universidad Nacional Autónoma de México (UNAM)"
}

TEST_CONSULTATION_DATA = {
    "especie": "Canino",
    "raza": "Pastor Alemán",
    "edad": "5 años",
    "peso": "32 kg",
    "motivo_consulta": "Vómitos recurrentes y pérdida de apetito desde hace 3 días",
    "sintomas": "Vómitos amarillentos, letargia, rechazo al alimento, deshidratación leve",
    "duracion_sintomas": "3 días",
    "tratamientos_previos": "Ayuno de 12 horas, administración de suero oral",
    "historia_clinica": "Vacunación completa, desparasitación al día, sin antecedentes de cirugías"
}

TEST_OBSERVATIONS = {
    "parametros_vitales": "FC: 110 lpm, FR: 28 rpm, T: 39.2°C, mucosas pálidas",
    "ambiente_manejo": "Perro doméstico, alimentación con croquetas premium, acceso a jardín",
    "laboratorio_estudios": "Pendientes: hemograma completo, química sanguínea",
    "notas_adicionales": "Propietario refiere que el perro comió algo en el parque hace 4 días"
}

class VetMedProTester:
    def __init__(self):
        self.session = None
        self.test_vet_id = None
        self.test_consultation_id = None
        self.test_session_id = None
        self.results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }

    async def setup(self):
        """Initialize HTTP session"""
        self.session = aiohttp.ClientSession()

    async def cleanup(self):
        """Clean up HTTP session"""
        if self.session:
            await self.session.close()

    def log_result(self, test_name, success, message="", error=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if error:
            print(f"   Error: {error}")
            self.results["errors"].append(f"{test_name}: {error}")
        
        if success:
            self.results["passed"] += 1
        else:
            self.results["failed"] += 1
        print()

    async def test_health_check(self):
        """Test 1: Health Check - Root endpoint connectivity"""
        try:
            async with self.session.get(BASE_URL) as response:
                if response.status == 200:
                    data = await response.json()
                    if "VetMed Pro" in data.get("message", ""):
                        self.log_result("Health Check", True, "Backend is accessible and responding")
                        return True
                    else:
                        self.log_result("Health Check", False, f"Unexpected response: {data}")
                        return False
                else:
                    self.log_result("Health Check", False, f"HTTP {response.status}")
                    return False
        except Exception as e:
            self.log_result("Health Check", False, error=str(e))
            return False

    async def test_veterinarian_registration(self):
        """Test 2: Veterinarian Registration with Mexican license"""
        try:
            async with self.session.post(
                f"{API_BASE}/auth/register",
                json=TEST_VET_DATA,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    self.test_vet_id = data.get("id")
                    if self.test_vet_id and data.get("cedula_profesional") == TEST_VET_DATA["cedula_profesional"]:
                        self.log_result("Veterinarian Registration", True, 
                                      f"Registered vet ID: {self.test_vet_id}")
                        return True
                    else:
                        self.log_result("Veterinarian Registration", False, 
                                      f"Invalid response data: {data}")
                        return False
                else:
                    error_data = await response.text()
                    self.log_result("Veterinarian Registration", False, 
                                  f"HTTP {response.status}: {error_data}")
                    return False
        except Exception as e:
            self.log_result("Veterinarian Registration", False, error=str(e))
            return False

    async def test_veterinarian_login(self):
        """Test 3: Veterinarian Login with registered credentials"""
        if not self.test_vet_id:
            self.log_result("Veterinarian Login", False, "No registered vet to test login")
            return False

        try:
            login_data = {
                "email": TEST_VET_DATA["email"],
                "cedula_profesional": TEST_VET_DATA["cedula_profesional"]
            }
            
            async with self.session.post(
                f"{API_BASE}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get("id") == self.test_vet_id:
                        self.log_result("Veterinarian Login", True, "Login successful")
                        return True
                    else:
                        self.log_result("Veterinarian Login", False, 
                                      f"ID mismatch: expected {self.test_vet_id}, got {data.get('id')}")
                        return False
                else:
                    error_data = await response.text()
                    self.log_result("Veterinarian Login", False, 
                                  f"HTTP {response.status}: {error_data}")
                    return False
        except Exception as e:
            self.log_result("Veterinarian Login", False, error=str(e))
            return False

    async def test_invalid_login(self):
        """Test 4: Invalid Login Attempts"""
        try:
            invalid_login = {
                "email": "invalid@email.com",
                "cedula_profesional": "000000"
            }
            
            async with self.session.post(
                f"{API_BASE}/auth/login",
                json=invalid_login,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 401:
                    self.log_result("Invalid Login Test", True, "Correctly rejected invalid credentials")
                    return True
                else:
                    self.log_result("Invalid Login Test", False, 
                                  f"Expected 401, got {response.status}")
                    return False
        except Exception as e:
            self.log_result("Invalid Login Test", False, error=str(e))
            return False

    async def test_animal_categories(self):
        """Test 5: Retrieve Animal Categories"""
        try:
            async with self.session.get(f"{API_BASE}/animal-categories") as response:
                if response.status == 200:
                    data = await response.json()
                    categories = data.get("categories", {})
                    expected_categories = ["pequeñas", "produccion", "equinos", "exoticos"]
                    
                    if all(cat in categories for cat in expected_categories):
                        self.log_result("Animal Categories", True, 
                                      f"Retrieved {len(categories)} categories")
                        return True
                    else:
                        self.log_result("Animal Categories", False, 
                                      f"Missing categories. Got: {list(categories.keys())}")
                        return False
                else:
                    self.log_result("Animal Categories", False, f"HTTP {response.status}")
                    return False
        except Exception as e:
            self.log_result("Animal Categories", False, error=str(e))
            return False

    async def test_membership_packages(self):
        """Test 6: Retrieve Membership Packages"""
        try:
            async with self.session.get(f"{API_BASE}/membership/packages") as response:
                if response.status == 200:
                    data = await response.json()
                    packages = data.get("packages", {})
                    expected_packages = ["basic", "professional", "premium"]
                    
                    if all(pkg in packages for pkg in expected_packages):
                        self.log_result("Membership Packages", True, 
                                      f"Retrieved {len(packages)} packages")
                        return True
                    else:
                        self.log_result("Membership Packages", False, 
                                      f"Missing packages. Got: {list(packages.keys())}")
                        return False
                else:
                    self.log_result("Membership Packages", False, f"HTTP {response.status}")
                    return False
        except Exception as e:
            self.log_result("Membership Packages", False, error=str(e))
            return False

    async def test_create_checkout_session(self):
        """Test 7: Create Stripe Checkout Session"""
        try:
            checkout_data = {
                "package_id": "basic",
                "origin_url": BASE_URL
            }
            
            async with self.session.post(
                f"{API_BASE}/payments/checkout/session",
                json=checkout_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    self.test_session_id = data.get("session_id")
                    checkout_url = data.get("checkout_url")
                    
                    if self.test_session_id and checkout_url:
                        self.log_result("Stripe Checkout Session", True, 
                                      f"Session ID: {self.test_session_id}")
                        return True
                    else:
                        self.log_result("Stripe Checkout Session", False, 
                                      f"Missing session data: {data}")
                        return False
                else:
                    error_data = await response.text()
                    self.log_result("Stripe Checkout Session", False, 
                                  f"HTTP {response.status}: {error_data}")
                    return False
        except Exception as e:
            self.log_result("Stripe Checkout Session", False, error=str(e))
            return False

    async def test_checkout_status(self):
        """Test 8: Check Payment Status"""
        if not self.test_session_id:
            self.log_result("Payment Status Check", False, "No session ID to check")
            return False

        try:
            async with self.session.get(
                f"{API_BASE}/payments/checkout/status/{self.test_session_id}"
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    status = data.get("status")
                    payment_status = data.get("payment_status")
                    
                    if status and payment_status:
                        self.log_result("Payment Status Check", True, 
                                      f"Status: {status}, Payment: {payment_status}")
                        return True
                    else:
                        self.log_result("Payment Status Check", False, 
                                      f"Missing status data: {data}")
                        return False
                else:
                    error_data = await response.text()
                    self.log_result("Payment Status Check", False, 
                                  f"HTTP {response.status}: {error_data}")
                    return False
        except Exception as e:
            self.log_result("Payment Status Check", False, error=str(e))
            return False

    async def test_create_consultation(self):
        """Test 9: Create Consultation (requires membership - will test without)"""
        if not self.test_vet_id:
            self.log_result("Create Consultation", False, "No vet ID available")
            return False

        try:
            consultation_request = {
                "veterinarian_id": self.test_vet_id,
                "category": "pequeñas",
                "consultation_data": TEST_CONSULTATION_DATA
            }
            
            async with self.session.post(
                f"{API_BASE}/consultations",
                json=consultation_request,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    self.test_consultation_id = data.get("id")
                    self.log_result("Create Consultation", True, 
                                  f"Consultation ID: {self.test_consultation_id}")
                    return True
                elif response.status == 403:
                    # Expected - no membership
                    error_data = await response.json()
                    if "Membresía requerida" in error_data.get("detail", ""):
                        self.log_result("Create Consultation", True, 
                                      "Correctly requires membership")
                        return True
                    else:
                        self.log_result("Create Consultation", False, 
                                      f"Unexpected 403 error: {error_data}")
                        return False
                else:
                    error_data = await response.text()
                    self.log_result("Create Consultation", False, 
                                  f"HTTP {response.status}: {error_data}")
                    return False
        except Exception as e:
            self.log_result("Create Consultation", False, error=str(e))
            return False

    async def test_consultation_history(self):
        """Test 10: Get Consultation History"""
        if not self.test_vet_id:
            self.log_result("Consultation History", False, "No vet ID available")
            return False

        try:
            async with self.session.get(
                f"{API_BASE}/consultations/{self.test_vet_id}/history"
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    consultations = data.get("consultations", [])
                    self.log_result("Consultation History", True, 
                                  f"Retrieved {len(consultations)} consultations")
                    return True
                else:
                    error_data = await response.text()
                    self.log_result("Consultation History", False, 
                                  f"HTTP {response.status}: {error_data}")
                    return False
        except Exception as e:
            self.log_result("Consultation History", False, error=str(e))
            return False

    async def test_llm_integration_mock(self):
        """Test 11: LLM Integration (Mock test - check if endpoint exists)"""
        # Since we can't create a consultation without membership, 
        # we'll test if the analyze endpoint exists with a fake ID
        try:
            fake_consultation_id = str(uuid.uuid4())
            async with self.session.post(
                f"{API_BASE}/consultations/{fake_consultation_id}/analyze"
            ) as response:
                if response.status == 404:
                    # Expected - consultation not found
                    self.log_result("LLM Integration Endpoint", True, 
                                  "Analyze endpoint exists and validates consultation ID")
                    return True
                elif response.status == 403:
                    # Also acceptable - membership required
                    self.log_result("LLM Integration Endpoint", True, 
                                  "Analyze endpoint exists and requires membership")
                    return True
                else:
                    error_data = await response.text()
                    self.log_result("LLM Integration Endpoint", False, 
                                  f"Unexpected response {response.status}: {error_data}")
                    return False
        except Exception as e:
            self.log_result("LLM Integration Endpoint", False, error=str(e))
            return False

    async def test_database_persistence(self):
        """Test 12: Database Persistence - Verify vet data is stored"""
        if not self.test_vet_id:
            self.log_result("Database Persistence", False, "No vet ID to verify")
            return False

        try:
            async with self.session.get(
                f"{API_BASE}/veterinarians/{self.test_vet_id}"
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    if (data.get("email") == TEST_VET_DATA["email"] and 
                        data.get("cedula_profesional") == TEST_VET_DATA["cedula_profesional"]):
                        self.log_result("Database Persistence", True, 
                                      "Veterinarian data correctly stored and retrieved")
                        return True
                    else:
                        self.log_result("Database Persistence", False, 
                                      "Data mismatch in stored veterinarian")
                        return False
                else:
                    error_data = await response.text()
                    self.log_result("Database Persistence", False, 
                                  f"HTTP {response.status}: {error_data}")
                    return False
        except Exception as e:
            self.log_result("Database Persistence", False, error=str(e))
            return False

    async def run_all_tests(self):
        """Run all tests in sequence"""
        print("🧪 VetMed Pro Backend Testing Suite")
        print("=" * 50)
        print(f"Testing against: {BASE_URL}")
        print()

        await self.setup()
        
        try:
            # Core functionality tests
            await self.test_health_check()
            await self.test_veterinarian_registration()
            await self.test_veterinarian_login()
            await self.test_invalid_login()
            await self.test_animal_categories()
            
            # Payment system tests
            await self.test_membership_packages()
            await self.test_create_checkout_session()
            await self.test_checkout_status()
            
            # Consultation system tests
            await self.test_create_consultation()
            await self.test_consultation_history()
            await self.test_llm_integration_mock()
            
            # Database tests
            await self.test_database_persistence()
            
        finally:
            await self.cleanup()

        # Print summary
        print("=" * 50)
        print("📊 TEST SUMMARY")
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        print(f"📈 Success Rate: {(self.results['passed']/(self.results['passed']+self.results['failed'])*100):.1f}%")
        
        if self.results['errors']:
            print("\n🚨 ERRORS ENCOUNTERED:")
            for error in self.results['errors']:
                print(f"   • {error}")
        
        return self.results['failed'] == 0

async def main():
    """Main test runner"""
    tester = VetMedProTester()
    success = await tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())