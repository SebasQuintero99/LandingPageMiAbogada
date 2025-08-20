const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@miabogada.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Administrador';

    // Verificar si ya existe un admin
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('❌ El usuario administrador ya existe');
      return;
    }

    // Crear admin
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Usuario administrador creado exitosamente');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Contraseña: ${adminPassword}`);
    console.log('');
    console.log('🚨 IMPORTANTE: Cambia la contraseña después del primer login');

  } catch (error) {
    console.error('❌ Error creando administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;