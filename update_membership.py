#!/usr/bin/env python3
import asyncio
import os
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def update_membership():
    # Database setup
    client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
    db = client[os.getenv("DB_NAME", "vetmed_platform")]
    
    # User ID
    user_id = "716d97d1-b011-4f6d-9592-2d00d37d9ae8"
    
    # Calculate membership expiry (30 days from now)
    expiry_date = datetime.now(timezone.utc)
    # Add 30 days
    import calendar
    if expiry_date.month == 12:
        expiry_date = expiry_date.replace(year=expiry_date.year + 1, month=1)
    else:
        expiry_date = expiry_date.replace(month=expiry_date.month + 1)
    
    # Update veterinarian with Premium membership
    membership_data = {
        "membership_type": "premium",
        "consultations_remaining": 999999,  # Unlimited for premium
        "membership_expires": expiry_date.isoformat(),
        "verified": True  # Also verify the account
    }
    
    result = await db.veterinarians.update_one(
        {"id": user_id},
        {"$set": membership_data}
    )
    
    if result.modified_count > 0:
        print("✅ Membresía Premium agregada exitosamente!")
        print(f"   - Tipo: Premium")
        print(f"   - Consultas: Ilimitadas")
        print(f"   - Vence: {expiry_date.strftime('%Y-%m-%d')}")
        print(f"   - Cuenta verificada: Sí")
    else:
        print("❌ Error actualizando membresía")
    
    # Verify update
    user = await db.veterinarians.find_one({"id": user_id})
    if user:
        print(f"\n📋 Estado actual del usuario:")
        print(f"   - Nombre: {user['nombre']}")
        print(f"   - Email: {user['email']}")
        print(f"   - Membresía: {user.get('membership_type', 'Ninguna')}")
        print(f"   - Consultas restantes: {user.get('consultations_remaining', 0)}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(update_membership())