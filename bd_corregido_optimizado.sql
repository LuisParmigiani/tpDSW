-- Script optimizado para poblar la base de datos HomeService
-- Base de datos: homeservice
-- IMPORTANTE: Este script limpia y repobla completamente la base de datos

USE `homeservice`;

-- Limpiar datos existentes
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE turno;
TRUNCATE TABLE servicio;
TRUNCATE TABLE usuario_zonas;
TRUNCATE TABLE usuario_tipos_de_servicio;
TRUNCATE TABLE horario;
TRUNCATE TABLE tarea;
TRUNCATE TABLE tipo_servicio;
TRUNCATE TABLE usuario;
TRUNCATE TABLE zona;
SET FOREIGN_KEY_CHECKS = 1;


-- 1. INSERTAR ZONAS
INSERT INTO `zona` (`descripcion_zona`) VALUES
('Centro'),
('Norte'), 
('Sur'),
('Este'),
('Oeste');

-- 2. INSERTAR USUARIOS (45 Clientes + 35 Prestadores = 80 total)
INSERT INTO `usuario` (`mail`, `contrasena`, `tipo_doc`, `numero_doc`, `telefono`, `nombre`, `apellido`, `direccion`, `nombre_fantasia`, `descripcion`, `foto`) VALUES
-- CLIENTES (usuarios 1-30)
('maria.gonzalez@email.com', 'passa123', 'DNI', '12345678', '341-555-0101', 'María', 'González', 'Av. Pellegrini 1234', NULL, NULL, NULL),
('juan.perez@email.com', 'pass123', 'DNI', '23456789', '341-555-0102', 'Juan', 'Pérez', 'San Martín 567', NULL, NULL, NULL),
('ana.rodriguez@email.com', 'pass123', 'DNI', '34567890', '341-555-0103', 'Ana', 'Rodríguez', 'Córdoba 890', NULL, NULL, NULL),
('carlos.lopez@email.com', 'pass123', 'DNI', '45678901', '341-555-0104', 'Carlos', 'López', 'Mitre 234', NULL, NULL, NULL),
('laura.martinez@email.com', 'pass123', 'DNI', '56789012', '341-555-0105', 'Laura', 'Martínez', 'Sarmiento 345', NULL, NULL, NULL),
('diego.fernandez@email.com', 'pass123', 'DNI', '67890123', '341-555-0106', 'Diego', 'Fernández', 'Belgrano 456', NULL, NULL, NULL),
('sofia.garcia@email.com', 'pass123', 'DNI', '78901234', '341-555-0107', 'Sofía', 'García', 'Moreno 567', NULL, NULL, NULL),
('martin.silva@email.com', 'pass123', 'DNI', '89012345', '341-555-0108', 'Martín', 'Silva', 'Rivadavia 678', NULL, NULL, NULL),
('valentina.torres@email.com', 'pass123', 'DNI', '90123456', '341-555-0109', 'Valentina', 'Torres', 'Urquiza 789', NULL, NULL, NULL),
('alejandro.morales@email.com', 'pass123', 'DNI', '01234567', '341-555-0110', 'Alejandro', 'Morales', 'Francia 890', NULL, NULL, NULL),
('camila.ruiz@email.com', 'pass123', 'DNI', '11234567', '341-555-0111', 'Camila', 'Ruiz', 'Oroño 123', NULL, NULL, NULL),
('nicolas.herrera@email.com', 'pass123', 'DNI', '22234567', '341-555-0112', 'Nicolás', 'Herrera', 'Pueyrredón 234', NULL, NULL, NULL),
('florencia.castro@email.com', 'pass123', 'DNI', '33234567', '341-555-0113', 'Florencia', 'Castro', '27 de Febrero 345', NULL, NULL, NULL),
('sebastian.vargas@email.com', 'pass123', 'DNI', '44234567', '341-555-0114', 'Sebastián', 'Vargas', 'Laprida 456', NULL, NULL, NULL),
('agustina.mendoza@email.com', 'pass123', 'DNI', '55234567', '341-555-0115', 'Agustina', 'Mendoza', 'Entre Ríos 567', NULL, NULL, NULL),
('lucas.rodriguez@email.com', 'pass123', 'DNI', '66234567', '341-555-0116', 'Lucas', 'Rodríguez', 'Santa Fe 678', NULL, NULL, NULL),
('paula.gonzalez2@email.com', 'pass123', 'DNI', '77234567', '341-555-0117', 'Paula', 'González', 'Tucumán 789', NULL, NULL, NULL),
('federico.lopez2@email.com', 'pass123', 'DNI', '88234567', '341-555-0118', 'Federico', 'López', 'Mendoza 890', NULL, NULL, NULL),
('julieta.martinez2@email.com', 'pass123', 'DNI', '99234567', '341-555-0119', 'Julieta', 'Martínez', 'San Juan 123', NULL, NULL, NULL),
('gonzalo.fernandez2@email.com', 'pass123', 'DNI', '10234567', '341-555-0120', 'Gonzalo', 'Fernández', 'San Luis 234', NULL, NULL, NULL),
('esteban.morales@email.com', 'pass123', 'DNI', '20345678', '341-555-0121', 'Esteban', 'Morales', 'Bv. Oroño 1234', NULL, NULL, NULL),
('romina.silva@email.com', 'pass123', 'DNI', '30345678', '341-555-0122', 'Romina', 'Silva', '9 de Julio 567', NULL, NULL, NULL),
('matias.herrera@email.com', 'pass123', 'DNI', '40345678', '341-555-0123', 'Matías', 'Herrera', 'Presidente Roca 890', NULL, NULL, NULL),
('andrea.castro@email.com', 'pass123', 'DNI', '50345678', '341-555-0124', 'Andrea', 'Castro', 'Balcarce 234', NULL, NULL, NULL),
('ignacio.vargas@email.com', 'pass123', 'DNI', '60345678', '341-555-0125', 'Ignacio', 'Vargas', 'Wheelwright 345', NULL, NULL, NULL),
('celeste.mendoza@email.com', 'pass123', 'DNI', '70345678', '341-555-0126', 'Celeste', 'Mendoza', 'Dorrego 456', NULL, NULL, NULL),
('bruno.rodriguez@email.com', 'pass123', 'DNI', '80345678', '341-555-0127', 'Bruno', 'Rodríguez', 'Rioja 567', NULL, NULL, NULL),
('antonella.gonzalez@email.com', 'pass123', 'DNI', '90345678', '341-555-0128', 'Antonella', 'González', 'Catamarca 678', NULL, NULL, NULL),
('luciano.lopez@email.com', 'pass123', 'DNI', '11345678', '341-555-0129', 'Luciano', 'López', 'Jujuy 789', NULL, NULL, NULL),
('valeria.martinez@email.com', 'pass123', 'DNI', '22345678', '341-555-0130', 'Valeria', 'Martínez', 'Salta 890', NULL, NULL, NULL),

-- NUEVOS CLIENTES (usuarios 31-45)
('fernando.acosta@email.com', 'pass123', 'DNI', '33345678', '341-555-0131', 'Fernando', 'Acosta', 'Tucumán 901', NULL, NULL, NULL),
('gabriela.torres@email.com', 'pass123', 'DNI', '44345678', '341-555-0132', 'Gabriela', 'Torres', 'Santiago del Estero 012', NULL, NULL, NULL),
('ricardo.silva@email.com', 'pass123', 'DNI', '55345678', '341-555-0133', 'Ricardo', 'Silva', 'Formosa 123', NULL, NULL, NULL),
('patricia.mendez@email.com', 'pass123', 'DNI', '66345678', '341-555-0134', 'Patricia', 'Méndez', 'Chaco 234', NULL, NULL, NULL),
('alejandro.ruiz@email.com', 'pass123', 'DNI', '77345678', '341-555-0135', 'Alejandro', 'Ruiz', 'Misiones 345', NULL, NULL, NULL),
('carolina.jimenez@email.com', 'pass123', 'DNI', '88345678', '341-555-0136', 'Carolina', 'Jiménez', 'Corrientes 456', NULL, NULL, NULL),
('diego.morales@email.com', 'pass123', 'DNI', '99345678', '341-555-0137', 'Diego', 'Morales', 'Entre Ríos 567', NULL, NULL, NULL),
('monica.castro@email.com', 'pass123', 'DNI', '10445678', '341-555-0138', 'Mónica', 'Castro', 'Santa Fe 678', NULL, NULL, NULL),
('javier.herrera@email.com', 'pass123', 'DNI', '11445678', '341-555-0139', 'Javier', 'Herrera', 'La Pampa 789', NULL, NULL, NULL),
('sandra.vargas@email.com', 'pass123', 'DNI', '12445678', '341-555-0140', 'Sandra', 'Vargas', 'Río Negro 890', NULL, NULL, NULL),
('pablo.gonzalez@email.com', 'pass123', 'DNI', '13445678', '341-555-0141', 'Pablo', 'González', 'Neuquén 901', NULL, NULL, NULL),
('elena.rodriguez@email.com', 'pass123', 'DNI', '14445678', '341-555-0142', 'Elena', 'Rodríguez', 'Chubut 012', NULL, NULL, NULL),
('martin.lopez@email.com', 'pass123', 'DNI', '15445678', '341-555-0143', 'Martín', 'López', 'Santa Cruz 123', NULL, NULL, NULL),
('silvia.martinez@email.com', 'pass123', 'DNI', '16445678', '341-555-0144', 'Silvia', 'Martínez', 'Tierra del Fuego 234', NULL, NULL, NULL),
('carlos.fernandez@email.com', 'pass123', 'DNI', '17445678', '341-555-0145', 'Carlos', 'Fernández', 'Antártida 345', NULL, NULL, NULL),

-- PRESTADORES (usuarios 46-70)
('limpieza.total@email.com', 'prest123', 'CUIT', '20-12345678-9', '341-666-0201', 'Roberto', 'Limpieza', 'Zona Industrial 123', 'Limpieza Total', 'Empresa de limpieza profesional', 'limpieza_total.jpg'),
('plomeria.herrera@email.com', 'prest123', 'CUIT', '20-23456789-0', '341-666-0202', 'Miguel', 'Herrera', 'Barrio Norte 234', 'Plomer Herrera', 'Servicios de plomería 24hs', 'plomeria_herrera.jpg'),
('electricidad.ramirez@email.com', 'prest123', 'CUIT', '20-34567890-1', '341-666-0203', 'Eduardo', 'Ramírez', 'Centro 345', 'Electri Ramírez', 'Instalaciones eléctricas certificadas', 'electricidad_ramirez.jpg'),
('jardines.vega@email.com', 'prest123', 'CUIT', '20-45678901-2', '341-666-0204', 'Francisco', 'Vega', 'Zona Sur 456', 'Jardines Vega', 'Paisajismo y mantenimiento', 'jardines_vega.jpg'),
('pintura.moreno@email.com', 'prest123', 'CUIT', '20-56789012-3', '341-666-0205', 'Gustavo', 'Moreno', 'Zona Este 567', 'Pintura Moreno', 'Pintura y decoración', 'pintura_moreno.jpg'),
('carpinteria.ruiz@email.com', 'prest123', 'CUIT', '20-67890123-4', '341-666-0206', 'Raúl', 'Ruiz', 'Zona Oeste 678', 'Carpint Ruiz', 'Muebles a medida', 'carpinteria_ruiz.jpg'),
('construcciones.diaz@email.com', 'prest123', 'CUIT', '20-78901234-5', '341-666-0207', 'Oscar', 'Díaz', 'Periferia 789', 'Constru Díaz', 'Obras y reformas', 'construcciones_diaz.jpg'),
('cerrajeria.flores@email.com', 'prest123', 'CUIT', '20-89012345-6', '341-666-0208', 'Horacio', 'Flores', 'Centro 890', 'Cerraj Flores', 'Seguridad 24hs', 'cerrajeria_flores.jpg'),
('clima.service@email.com', 'prest123', 'CUIT', '20-90123456-7', '341-666-0209', 'Sergio', 'Clima', 'Zona Norte 123', 'Clima Service', 'Aires acondicionados', 'clima_service.jpg'),
('reparaciones.express@email.com', 'prest123', 'CUIT', '20-01234567-8', '341-666-0210', 'Daniel', 'Reparaciones', 'Centro 234', 'Repara Express', 'Arreglos rápidos', 'reparaciones_express.jpg'),
('tecnicos.garcia@email.com', 'prest123', 'CUIT', '20-11234567-9', '341-666-0211', 'Marcelo', 'García', 'Zona Sur 345', 'Técnicos García', 'Servicios especializados', 'tecnicos_garcia.jpg'),
('mantenimientos.lopez@email.com', 'prest123', 'CUIT', '20-22234567-0', '341-666-0212', 'Alberto', 'López', 'Zona Este 456', 'Mantto López', 'Mantenimiento integral', 'mantenimientos_lopez.jpg'),
('hogar.martin@email.com', 'prest123', 'CUIT', '20-33234567-1', '341-666-0213', 'Gabriel', 'Martín', 'Zona Oeste 567', 'Hogar Martín', 'Todo para su hogar', 'hogar_martin.jpg'),
('integrales.torres@email.com', 'prest123', 'CUIT', '20-44234567-2', '341-666-0214', 'Fernando', 'Torres', 'Centro 678', 'Integra Torres', 'Soluciones completas', 'integrales_torres.jpg'),
('jardin.vera@email.com', 'prest123', 'CUIT', '20-55234567-3', '341-666-0215', 'Andrés', 'Vera', 'Zona Norte 789', 'Jardín Vera', 'Espacios verdes', 'jardin_vera.jpg'),
('inmobiliarios.castro@email.com', 'prest123', 'CUIT', '20-66234567-4', '341-666-0216', 'Ricardo', 'Castro', 'Centro 890', 'Inmob Castro', 'Administración de propiedades', 'inmobiliarios_castro.jpg'),
('multiservicios.pena@email.com', 'prest123', 'CUIT', '20-77234567-5', '341-666-0217', 'Javier', 'Peña', 'Zona Sur 123', 'Multi Peña', 'Todo tipo de servicios', 'multiservicios_pena.jpg'),
('profesionales.ortega@email.com', 'prest123', 'CUIT', '20-88234567-6', '341-666-0218', 'Leonardo', 'Ortega', 'Zona Este 234', 'Profes Ortega', 'Calidad garantizada', 'profesionales_ortega.jpg'),
('especializados.silva@email.com', 'prest123', 'CUIT', '20-99234567-7', '341-666-0219', 'Cristian', 'Silva', 'Zona Oeste 345', 'Especial Silva', 'Expertos en servicios', 'especializados_silva.jpg'),
('pintura.profesional@email.com', 'prest123', 'CUIT', '20-10234567-8', '341-666-0220', 'Maximiliano', 'Pintura', 'Centro 456', 'Pintu Pro', 'Pintura de alta calidad', 'pintura_profesional.jpg'),
('veterinaria.salud@email.com', 'prest123', 'CUIT', '20-20345678-9', '341-666-0221', 'Patricia', 'Veterinaria', 'Zona Norte 567', 'Vet Salud', 'Atención veterinaria integral', 'veterinaria_salud.jpg'),
('estetica.belleza@email.com', 'prest123', 'CUIT', '20-30345678-0', '341-666-0222', 'Mónica', 'Estética', 'Centro 678', 'Belleza Total', 'Servicios de peluquería y estética', 'estetica_belleza.jpg'),
('coaching.desarrollo@email.com', 'prest123', 'CUIT', '20-40345678-1', '341-666-0223', 'Roberto', 'Coach', 'Zona Este 789', 'Desarr Personal', 'Coach profesional certificado', 'coaching_desarrollo.jpg'),
('traduccion.idiomas@email.com', 'prest123', 'CUIT', '20-50345678-2', '341-666-0224', 'Laura', 'Traductora', 'Centro 890', 'Idiomas Pro', 'Traducción e interpretación', 'traduccion_idiomas.jpg'),
('desarrollo.software@email.com', 'prest123', 'CUIT', '20-60345678-3', '341-666-0225', 'Carlos', 'Developer', 'Zona Sur 123', 'Code Solutions', 'Desarrollo de software a medida', 'desarrollo_software.jpg'),
('marketing.digital@email.com', 'prest123', 'CUIT', '20-70345678-4', '341-666-0226', 'Ana', 'Marketing', 'Zona Oeste 234', 'Digital Growth', 'Marketing digital y SEO', 'marketing_digital.jpg'),
('arquitectura.ingeniera@email.com', 'prest123', 'CUIT', '20-80345678-5', '341-666-0227', 'Miguel', 'Arquitecto', 'Centro 345', 'Diseños Arqui', 'Proyectos arquitectónicos', 'arquitectura_ingeniera.jpg'),
('legal.servicios@email.com', 'prest123', 'CUIT', '20-90345678-6', '341-666-0228', 'Sofía', 'Abogada', 'Zona Norte 456', 'Legal Integral', 'Asesoramiento jurídico', 'legal_servicios.jpg'),
('psicologia.terapia@email.com', 'prest123', 'CUIT', '20-11345678-7', '341-666-0229', 'Diego', 'Psicólogo', 'Centro 567', 'Bienestar', 'Terapia psicológica', 'psicologia_terapia.jpg'),
('nutricion.deportiva@email.com', 'prest123', 'CUIT', '20-22345678-8', '341-666-0230', 'Fernanda', 'Nutricionista', 'Zona Este 678', 'Nutrición Pro', 'Nutrición deportiva especializada', 'nutricion_deportiva.jpg'),

('deportes.entrenamiento@email.com', 'prest123', 'CUIT', '20-77445678-3', '341-666-0235', 'Lucía', 'Entrenadora', 'Zona Deportiva 123', 'Fitness Total', 'Entrenamiento personalizado', 'deportes_entrenamiento.jpg');

-- 3. INSERTAR HORARIOS (7 horarios por cada prestador = 245 horarios: 210 existentes + 35 nuevos)
-- Prestadores del 46 al 75, cada uno con horarios del domingo (0) al sábado (6)
INSERT INTO `horario` (`dia_semana`, `hora_desde`, `hora_hasta`, `usuario_id`) VALUES
-- Prestador 31 (Limpieza Total)
(0, '09:00:00', '17:00:00', 46), -- Domingo
(1, '08:00:00', '18:00:00', 46), -- Lunes
(2, '08:00:00', '18:00:00', 46), -- Martes
(3, '08:00:00', '18:00:00', 46), -- Miércoles
(4, '08:00:00', '18:00:00', 46), -- Jueves
(5, '08:00:00', '18:00:00', 46), -- Viernes
(6, '09:00:00', '15:00:00', 46), -- Sábado

-- Prestador 32 (Plomería Herrera)
(0, '00:00:00', '00:00:00', 47), -- Domingo cerrado
(1, '07:00:00', '19:00:00', 47), -- Lunes
(2, '07:00:00', '19:00:00', 47), -- Martes
(3, '07:00:00', '19:00:00', 47), -- Miércoles
(4, '07:00:00', '19:00:00', 47), -- Jueves
(5, '07:00:00', '19:00:00', 47), -- Viernes
(6, '08:00:00', '16:00:00', 47), -- Sábado

-- Prestador 33 (Electricidad Ramírez)
(0, '10:00:00', '16:00:00', 48), -- Domingo
(1, '08:00:00', '18:00:00', 48), -- Lunes
(2, '08:00:00', '18:00:00', 48), -- Martes
(3, '08:00:00', '18:00:00', 48), -- Miércoles
(4, '08:00:00', '18:00:00', 48), -- Jueves
(5, '08:00:00', '18:00:00', 48), -- Viernes
(6, '09:00:00', '17:00:00', 48), -- Sábado

-- Prestador 49 (Jardines Vega)
(0, '08:00:00', '14:00:00', 48), -- Domingo
(1, '07:00:00', '17:00:00', 48), -- Lunes
(2, '07:00:00', '17:00:00', 48), -- Martes
(3, '07:00:00', '17:00:00', 48), -- Miércoles
(4, '07:00:00', '17:00:00', 48), -- Jueves
(5, '07:00:00', '17:00:00', 48), -- Viernes
(6, '08:00:00', '16:00:00', 48), -- Sábado

-- Prestador 50 (Pintura Moreno)
(0, '00:00:00', '00:00:00', 50), -- Domingo cerrado
(1, '08:00:00', '18:00:00', 50), -- Lunes
(2, '08:00:00', '18:00:00', 50), -- Martes
(3, '08:00:00', '18:00:00', 50), -- Miércoles
(4, '08:00:00', '18:00:00', 50), -- Jueves
(5, '08:00:00', '18:00:00', 50), -- Viernes
(6, '09:00:00', '15:00:00', 50), -- Sábado

-- Prestador 51 (Carpintería Ruiz)
(0, '09:00:00', '17:00:00', 51), -- Domingo
(1, '07:00:00', '18:00:00', 51), -- Lunes
(2, '07:00:00', '18:00:00', 51), -- Martes
(3, '07:00:00', '18:00:00', 51), -- Miércoles
(4, '07:00:00', '18:00:00', 51), -- Jueves
(5, '07:00:00', '18:00:00', 51), -- Viernes
(6, '08:00:00', '16:00:00', 51), -- Sábado

-- Prestador 52 (Construcciones Díaz)
(0, '08:00:00', '16:00:00', 52), -- Domingo
(1, '07:00:00', '19:00:00', 52), -- Lunes
(2, '07:00:00', '19:00:00', 52), -- Martes
(3, '07:00:00', '19:00:00', 52), -- Miércoles
(4, '07:00:00', '19:00:00', 52), -- Jueves
(5, '07:00:00', '19:00:00', 52), -- Viernes
(6, '08:00:00', '17:00:00', 52), -- Sábado

-- Prestador 53 (Cerrajería Flores)
(0, '09:00:00', '21:00:00', 53), -- Domingo
(1, '00:00:00', '23:59:59', 53), -- Lunes - 24hs
(2, '00:00:00', '23:59:59', 53), -- Martes - 24hs
(3, '00:00:00', '23:59:59', 53), -- Miércoles - 24hs
(4, '00:00:00', '23:59:59', 53), -- Jueves - 24hs
(5, '00:00:00', '23:59:59', 53), -- Viernes - 24hs
(6, '00:00:00', '23:59:59', 53), -- Sábado - 24hs

-- Prestador 54 (Clima Service)
(0, '10:00:00', '18:00:00', 54), -- Domingo
(1, '08:00:00', '20:00:00', 54), -- Lunes
(2, '08:00:00', '20:00:00', 54), -- Martes
(3, '08:00:00', '20:00:00', 54), -- Miércoles
(4, '08:00:00', '20:00:00', 54), -- Jueves
(5, '08:00:00', '20:00:00', 54), -- Viernes
(6, '09:00:00', '17:00:00', 54), -- Sábado

-- Prestador 55 (Reparaciones Express)
(0, '09:00:00', '17:00:00', 55), -- Domingo
(1, '08:00:00', '19:00:00', 55), -- Lunes
(2, '08:00:00', '19:00:00', 55), -- Martes
(3, '08:00:00', '19:00:00', 55), -- Miércoles
(4, '08:00:00', '19:00:00', 55), -- Jueves
(5, '08:00:00', '19:00:00', 55), -- Viernes
(6, '09:00:00', '16:00:00', 55), -- Sábado

-- Prestador 41 (Técnicos García)
(0, '00:00:00', '00:00:00', 69), -- Domingo cerrado
(1, '08:00:00', '18:00:00', 69), -- Lunes
(2, '08:00:00', '18:00:00', 69), -- Martes
(3, '08:00:00', '18:00:00', 69), -- Miércoles
(4, '08:00:00', '18:00:00', 69), -- Jueves
(5, '08:00:00', '18:00:00', 69), -- Viernes
(6, '10:00:00', '15:00:00', 69), -- Sábado

-- Prestador 42 (Mantenimientos López)
(0, '08:00:00', '16:00:00', 70), -- Domingo
(1, '07:00:00', '19:00:00', 70), -- Lunes
(2, '07:00:00', '19:00:00', 70), -- Martes
(3, '07:00:00', '19:00:00', 70), -- Miércoles
(4, '07:00:00', '19:00:00', 70), -- Jueves
(5, '07:00:00', '19:00:00', 70), -- Viernes
(6, '08:00:00', '17:00:00', 70), -- Sábado

-- Prestador 43 (Servicios del Hogar Martín)
(0, '10:00:00', '18:00:00', 71), -- Domingo
(1, '08:00:00', '20:00:00', 71), -- Lunes
(2, '08:00:00', '20:00:00', 71), -- Martes
(3, '08:00:00', '20:00:00', 71), -- Miércoles
(4, '08:00:00', '20:00:00', 71), -- Jueves
(5, '08:00:00', '20:00:00', 71), -- Viernes
(6, '09:00:00', '17:00:00', 71), -- Sábado

-- Prestador 44 (Servicios Integrales Torres)
(0, '09:00:00', '17:00:00', 72), -- Domingo
(1, '08:00:00', '18:00:00', 72), -- Lunes
(2, '08:00:00', '18:00:00', 72), -- Martes
(3, '08:00:00', '18:00:00', 72), -- Miércoles
(4, '08:00:00', '18:00:00', 72), -- Jueves
(5, '08:00:00', '18:00:00', 72), -- Viernes
(6, '09:00:00', '16:00:00', 72), -- Sábado

-- Prestador 45 (Hogar y Jardín Vera)
(0, '08:00:00', '15:00:00', 73), -- Domingo
(1, '07:00:00', '18:00:00', 73), -- Lunes
(2, '07:00:00', '18:00:00', 73), -- Martes
(3, '07:00:00', '18:00:00', 73), -- Miércoles
(4, '07:00:00', '18:00:00', 73), -- Jueves
(5, '07:00:00', '18:00:00', 73), -- Viernes
(6, '08:00:00', '16:00:00', 73), -- Sábado

-- Prestador 46 (Servicios Inmobiliarios Castro)
(0, '00:00:00', '00:00:00', 46), -- Domingo cerrado
(1, '09:00:00', '18:00:00', 46), -- Lunes
(2, '09:00:00', '18:00:00', 46), -- Martes
(3, '09:00:00', '18:00:00', 46), -- Miércoles
(4, '09:00:00', '18:00:00', 46), -- Jueves
(5, '09:00:00', '18:00:00', 46), -- Viernes
(6, '10:00:00', '15:00:00', 46), -- Sábado

-- Prestador 47 (Multi-Servicios Peña)
(0, '10:00:00', '18:00:00', 47), -- Domingo
(1, '08:00:00', '19:00:00', 47), -- Lunes
(2, '08:00:00', '19:00:00', 47), -- Martes
(3, '08:00:00', '19:00:00', 47), -- Miércoles
(4, '08:00:00', '19:00:00', 47), -- Jueves
(5, '08:00:00', '19:00:00', 47), -- Viernes
(6, '09:00:00', '17:00:00', 47), -- Sábado

-- Prestador 48 (Servicios Profesionales Ortega)
(0, '09:00:00', '17:00:00', 48), -- Domingo
(1, '08:00:00', '18:00:00', 48), -- Lunes
(2, '08:00:00', '18:00:00', 48), -- Martes
(3, '08:00:00', '18:00:00', 48), -- Miércoles
(4, '08:00:00', '18:00:00', 48), -- Jueves
(5, '08:00:00', '18:00:00', 48), -- Viernes
(6, '09:00:00', '16:00:00', 48), -- Sábado

-- Prestador 49 (Servicios Especializados Silva)
(0, '08:00:00', '16:00:00', 50), -- Domingo
(1, '07:00:00', '19:00:00', 50), -- Lunes
(2, '07:00:00', '19:00:00', 50), -- Martes
(3, '07:00:00', '19:00:00', 50), -- Miércoles
(4, '07:00:00', '19:00:00', 50), -- Jueves
(5, '07:00:00', '19:00:00', 50), -- Viernes
(6, '08:00:00', '17:00:00', 50), -- Sábado

-- Prestador 50 (Pintura Profesional)
(0, '00:00:00', '00:00:00', 51), -- Domingo cerrado
(1, '08:00:00', '18:00:00', 51), -- Lunes
(2, '08:00:00', '18:00:00', 51), -- Martes
(3, '08:00:00', '18:00:00', 51), -- Miércoles
(4, '08:00:00', '18:00:00', 51), -- Jueves
(5, '08:00:00', '18:00:00', 51), -- Viernes
(6, '09:00:00', '15:00:00', 51), -- Sábado

-- Prestador 51 (Veterinaria Salud Animal)
(0, '09:00:00', '13:00:00', 52), -- Domingo
(1, '08:00:00', '20:00:00', 52), -- Lunes
(2, '08:00:00', '20:00:00', 52), -- Martes
(3, '08:00:00', '20:00:00', 52), -- Miércoles
(4, '08:00:00', '20:00:00', 52), -- Jueves
(5, '08:00:00', '20:00:00', 52), -- Viernes
(6, '09:00:00', '18:00:00', 52), -- Sábado

-- Prestador 52 (Belleza Total)
(0, '10:00:00', '18:00:00', 53), -- Domingo
(1, '09:00:00', '21:00:00', 53), -- Lunes
(2, '09:00:00', '21:00:00', 53), -- Martes
(3, '09:00:00', '21:00:00', 53), -- Miércoles
(4, '09:00:00', '21:00:00', 53), -- Jueves
(5, '09:00:00', '21:00:00', 53), -- Viernes
(6, '09:00:00', '19:00:00', 53), -- Sábado

-- Prestador 53 (Desarrollo Personal)
(0, '00:00:00', '00:00:00', 54), -- Domingo cerrado
(1, '09:00:00', '18:00:00', 54), -- Lunes
(2, '09:00:00', '18:00:00', 54), -- Martes
(3, '09:00:00', '18:00:00', 54), -- Miércoles
(4, '09:00:00', '18:00:00', 54), -- Jueves
(5, '09:00:00', '18:00:00', 54), -- Viernes
(6, '10:00:00', '15:00:00', 54), -- Sábado

-- Prestador 54 (Idiomas Profesionales)
(0, '10:00:00', '16:00:00', 55), -- Domingo
(1, '08:00:00', '20:00:00', 55), -- Lunes
(2, '08:00:00', '20:00:00', 55), -- Martes
(3, '08:00:00', '20:00:00', 55), -- Miércoles
(4, '08:00:00', '20:00:00', 55), -- Jueves
(5, '08:00:00', '20:00:00', 55), -- Viernes
(6, '09:00:00', '17:00:00', 55), -- Sábado

-- Prestador 55 (Code Solutions)
(0, '12:00:00', '18:00:00', 69), -- Domingo
(1, '08:00:00', '22:00:00', 69), -- Lunes
(2, '08:00:00', '22:00:00', 69), -- Martes
(3, '08:00:00', '22:00:00', 69), -- Miércoles
(4, '08:00:00', '22:00:00', 69), -- Jueves
(5, '08:00:00', '22:00:00', 69), -- Viernes
(6, '10:00:00', '18:00:00', 69), -- Sábado

-- Prestador 56 (Digital Growth)
(0, '10:00:00', '16:00:00', 70), -- Domingo
(1, '09:00:00', '19:00:00', 70), -- Lunes
(2, '09:00:00', '19:00:00', 70), -- Martes
(3, '09:00:00', '19:00:00', 70), -- Miércoles
(4, '09:00:00', '19:00:00', 70), -- Jueves
(5, '09:00:00', '19:00:00', 70), -- Viernes
(6, '10:00:00', '17:00:00', 70), -- Sábado

-- Prestador 57 (Diseños Arquitectónicos)
(0, '00:00:00', '00:00:00', 71), -- Domingo cerrado
(1, '08:00:00', '18:00:00', 71), -- Lunes
(2, '08:00:00', '18:00:00', 71), -- Martes
(3, '08:00:00', '18:00:00', 71), -- Miércoles
(4, '08:00:00', '18:00:00', 71), -- Jueves
(5, '08:00:00', '18:00:00', 71), -- Viernes
(6, '09:00:00', '15:00:00', 71), -- Sábado

-- Prestador 58 (Servicios Legales Integrales)
(0, '00:00:00', '00:00:00', 72), -- Domingo cerrado
(1, '09:00:00', '18:00:00', 72), -- Lunes
(2, '09:00:00', '18:00:00', 72), -- Martes
(3, '09:00:00', '18:00:00', 72), -- Miércoles
(4, '09:00:00', '18:00:00', 72), -- Jueves
(5, '09:00:00', '18:00:00', 72), -- Viernes
(6, '10:00:00', '14:00:00', 72), -- Sábado

-- Prestador 59 (Bienestar Mental)
(0, '10:00:00', '16:00:00', 73), -- Domingo
(1, '08:00:00', '20:00:00', 73), -- Lunes
(2, '08:00:00', '20:00:00', 73), -- Martes
(3, '08:00:00', '20:00:00', 73), -- Miércoles
(4, '08:00:00', '20:00:00', 73), -- Jueves
(5, '08:00:00', '20:00:00', 73), -- Viernes
(6, '09:00:00', '18:00:00', 73), -- Sábado

-- Prestador 60 (Nutrición Pro)
(0, '09:00:00', '15:00:00', 46), -- Domingo
(1, '08:00:00', '20:00:00', 46), -- Lunes
(2, '08:00:00', '20:00:00', 46), -- Martes
(3, '08:00:00', '20:00:00', 46), -- Miércoles
(4, '08:00:00', '20:00:00', 46), -- Jueves
(5, '08:00:00', '20:00:00', 75), -- Viernes
(6, '08:00:00', '18:00:00', 75), -- Sábado

(6, '08:00:00', '18:00:00', 75); -- Sábado

-- 4. INSERTAR TIPOS DE SERVICIO (40 tipos únicos)
INSERT INTO `tipo_servicio` (`nombre_tipo`, `descripcion_tipo`) VALUES
('Limpieza Residencial', 'Limpieza general del hogar y oficinas'),
('Plomería', 'Servicios de fontanería e instalaciones'),
('Electricidad', 'Instalaciones y reparaciones eléctricas'),
('Jardinería', 'Mantenimiento de jardines y espacios verdes'),
('Pintura', 'Pintura interior y exterior'),
('Carpintería', 'Trabajos en madera y muebles'),
('Construcción', 'Trabajos de construcción y albañilería'),
('Cerrajería', 'Servicios de seguridad y cerrajería'),
('Climatización', 'Instalación y reparación de aires acondicionados'),
('Reparaciones Generales', 'Reparaciones generales del hogar'),
('Servicios Técnicos', 'Servicios técnicos especializados'),
('Servicios del Hogar', 'Servicios diversos para el hogar'),
('Servicios Integrales', 'Servicios completos e integrales'),
('Hogar y Jardín', 'Servicios combinados de hogar y jardín'),
('Servicios Inmobiliarios', 'Servicios relacionados con inmuebles'),
('Limpieza Industrial', 'Limpieza especializada para industrias'),
('Control de Plagas', 'Control de plagas y fumigación'),
('Mantenimiento Integral', 'Mantenimiento completo de edificios'),
('Servicios de Piscinas', 'Mantenimiento y limpieza de piscinas'),
('Decoración Interior', 'Diseño y decoración de interiores'),
('Refrigeración', 'Servicios de frío y climatización'),
('Tecnología y Automatización', 'Servicios tecnológicos y automatización'),
('Seguridad del Hogar', 'Sistemas de seguridad residencial');

-- 5. INSERTAR TAREAS (350 tareas total: 300 existentes + 50 nuevas)
INSERT INTO `tarea` (`nombre_tarea`, `descripcion_tarea`, `duracion_tarea`, `tipo_servicio_id`) VALUES
-- Tipo 1: Limpieza Residencial
('Limpieza básica de hogar', 'Limpieza general de ambientes', 120, 1),
('Limpieza profunda', 'Limpieza detallada con desinfección', 180, 1),
('Limpieza post obra', 'Limpieza después de construcción', 240, 1),
('Limpieza de alfombras', 'Lavado y desinfección de alfombras', 90, 1),
('Limpieza de vidrios', 'Limpieza de ventanas y superficies de vidrio', 60, 1),
('Limpieza de techos', 'Limpieza de cubiertas y canaletas', 180, 1),
('Desinfección COVID', 'Sanitización especializada anti-COVID', 120, 1),
('Limpieza de vehículos', 'Lavado detallado de automóviles', 90, 1),
('Limpieza de oficinas', 'Limpieza comercial', 150, 1),
('Limpieza industrial pesada', 'Limpieza de maquinaria industrial', 300, 1),

-- Tipo 2: Plomería
('Reparación de canillas', 'Arreglo de grifería', 60, 2),
('Destapado de cañerías', 'Desobstrucción de desagües', 90, 2),
('Instalación de inodoro', 'Colocación de sanitarios', 120, 2),
('Reparación de calefón', 'Arreglo de calentadores de agua', 150, 2),
('Cambio de cañerías', 'Reemplazo de tuberías', 240, 2),
('Instalación de termotanques', 'Colocación de calentadores de agua', 180, 2),
('Reparación de bombas de agua', 'Arreglo de sistemas de bombeo', 120, 2),
('Instalación fontanería piscinas', 'Fontanería para piscinas', 300, 2),
('Servicios de gas', 'Instalación y reparación de gas', 180, 2),
('Sistemas de riego', 'Instalación de riego automático', 240, 2),

-- Tipo 3: Electricidad
('Instalación de tomas', 'Colocación de enchufes', 60, 3),
('Cambio de tablero eléctrico', 'Renovación del cuadro eléctrico', 240, 3),
('Reparación de iluminación', 'Arreglo de luminarias', 90, 3),
('Instalación de ventiladores', 'Colocación de ventiladores de techo', 120, 3),
('Revisión eléctrica general', 'Inspección completa de instalación', 180, 3),
('Instalación paneles solares', 'Sistemas fotovoltaicos residenciales', 480, 3),
('Automatización del hogar', 'Domótica y casa inteligente', 300, 3),
('Sistemas de seguridad eléctrica', 'Instalación de sistemas de seguridad', 180, 3),
('Reparación de motores', 'Arreglo de motores eléctricos', 180, 3),
('Instalación de cámaras', 'Circuito cerrado de TV', 240, 3),

-- Tipo 4: Jardinería
('Corte de césped', 'Mantenimiento del pasto', 60, 4),
('Poda de árboles', 'Recorte y limpieza de árboles', 120, 4),
('Plantación de flores', 'Siembra y plantación', 90, 4),
('Diseño de jardín básico', 'Planificación básica de espacios verdes', 180, 4),
('Riego automático', 'Instalación de sistema de riego', 240, 4),
('Mantenimiento de césped', 'Cuidado integral del pasto', 90, 4),
('Fumigación de plantas', 'Control de plagas en jardines', 60, 4),
('Limpieza de patios', 'Mantenimiento de espacios externos', 120, 4),
('Construcción de canteros', 'Armado de espacios para plantas', 180, 4),
('Mantenimiento de árboles frutales', 'Cuidado especializado de frutales', 150, 4),

-- Tipo 5: Pintura
('Pintura interior', 'Pintura de ambientes internos', 360, 5),
('Pintura exterior', 'Pintura de fachadas', 480, 5),
('Empapelado', 'Colocación de papel pintado', 180, 5),
('Pintura decorativa', 'Técnicas especiales de pintura', 240, 5),
('Preparación de paredes', 'Lijado y preparación de superficies', 120, 5),
('Pintura de techos', 'Pintura de cielorrasos', 240, 5),
('Pintura de rejas', 'Pintura de protecciones metálicas', 180, 5),
('Pintura artística', 'Técnicas especiales de pintura', 300, 5),
('Restauración de pintura', 'Reparación de pinturas dañadas', 240, 5),
('Pintura antihumedad', 'Tratamiento especial contra humedad', 180, 5),

-- Tipo 6: Carpintería
('Fabricación de muebles', 'Creación de mobiliario a medida', 720, 6),
('Reparación de puertas', 'Arreglo de puertas y marcos', 120, 6),
('Instalación de estantes', 'Colocación de repisas', 90, 6),
('Barnizado de madera', 'Tratamiento y acabado de madera', 180, 6),
('Construcción de deck', 'Armado de terrazas de madera', 480, 6),
('Instalación de pisos de madera', 'Colocación de parquet', 360, 6),
('Reparación de muebles', 'Arreglo de mobiliario', 150, 6),
('Construcción de pérgolas', 'Estructuras de madera para jardín', 300, 6),
('Instalación de zócalos', 'Colocación de molduras', 120, 6),
('Fabricación de escaleras', 'Construcción de escaleras de madera', 480, 6),

-- Tipo 7: Construcción
('Construcción de paredes', 'Levantamiento de muros', 480, 7),
('Instalación de pisos', 'Colocación de revestimientos', 360, 7),
('Reparación de techos', 'Arreglo de cubiertas', 300, 7),
('Construcción de baños', 'Armado completo de sanitarios', 720, 7),
('Refacciones menores', 'Pequeños arreglos edilicios', 180, 7),
('Construcción de cocinas', 'Armado completo de cocinas', 600, 7),
('Impermeabilización', 'Tratamiento contra filtraciones', 240, 7),
('Construcción de quinchos', 'Espacios de parrilla', 480, 7),
('Reparación de cimientos', 'Arreglo de estructuras', 360, 7),
('Construcción de garages', 'Espacios para vehículos', 720, 7),

-- Tipo 8: Cerrajería
('Cambio de cerraduras', 'Reemplazo de cerrojos', 60, 8),
('Apertura de cerraduras', 'Servicio de emergencia', 30, 8),
('Instalación de rejas', 'Colocación de protecciones', 180, 8),
('Duplicado de llaves', 'Copia de llaves', 15, 8),
('Reparación de portones', 'Arreglo de accesos vehiculares', 180, 8),
('Instalación de blindajes', 'Puertas de seguridad', 240, 8),
('Sistemas de acceso', 'Control de ingresos', 180, 8),
('Reparación de cajas fuertes', 'Arreglo de sistemas de seguridad', 120, 8),
('Instalación de cerrojos antipático', 'Sistemas de alta seguridad', 90, 8),
('Mantenimiento de portones automáticos', 'Servicio de automatización', 150, 8),

-- Tipo 9: Climatización
('Instalación de aire acondicionado', 'Colocación de equipos de clima', 180, 9),
('Mantenimiento de AA', 'Limpieza y revisión de aires', 90, 9),
('Reparación de calefacción', 'Arreglo de sistemas de calor', 180, 9),
('Instalación de ventilación', 'Sistemas de extracción de aire', 240, 9),
('Carga de gas refrigerante', 'Recarga de equipos de frío', 60, 9),
('Instalación de calefacción central', 'Sistemas de calefacción', 480, 9),
('Reparación de split', 'Arreglo de aires acondicionados', 120, 9),
('Instalación de extractores', 'Ventilación forzada', 90, 9),
('Mantenimiento de calderas', 'Servicio de equipos de calor', 150, 9),
('Instalación de termostatos', 'Control automático de temperatura', 60, 9),

-- Tipo 10: Reparaciones Generales
('Reparaciones menores', 'Arreglos domésticos varios', 120, 10),
('Arreglo de electrodomésticos', 'Reparación de aparatos eléctricos', 180, 10),
('Restauración de mobiliario', 'Restauración y reparación de muebles antiguos', 150, 10),
('Instalación de accesorios', 'Colocación de elementos varios', 60, 10),
('Mantenimiento preventivo', 'Revisión general del hogar', 180, 10),
('Reparación de ventanas', 'Arreglo de aberturas', 120, 10),
('Reparación de escaleras', 'Arreglo de escalones', 150, 10),
('Instalación de cortinas', 'Colocación de cortinados', 90, 10),
('Reparación de azulejos', 'Arreglo de revestimientos', 120, 10),
('Mantenimiento de balcones', 'Cuidado de espacios exteriores', 150, 10),

-- Tipo 11: Servicios Técnicos
('Reparación de PC', 'Arreglo de computadoras', 120, 11),
('Instalación de redes', 'Configuración de internet', 180, 11),
('Mantenimiento de equipos', 'Revisión técnica especializada', 150, 11),
('Configuración de sistemas', 'Setup de equipamiento', 90, 11),
('Soporte técnico general', 'Asesoramiento especializado', 60, 11),
('Instalación de software', 'Configuración de programas', 90, 11),
('Reparación de tablets', 'Arreglo de dispositivos móviles', 120, 11),
('Configuración de impresoras', 'Setup de equipos de impresión', 60, 11),
('Mantenimiento de servidores', 'Cuidado de equipos de red', 180, 11),
('Recuperación de datos', 'Salvado de información', 240, 11),

-- Tipo 12: Servicios del Hogar
('Limpieza doméstica', 'Servicio de mucama', 180, 12),
('Lavado de ropa', 'Servicio de lavandería', 120, 12),
('Planchado', 'Planchado de prendas', 90, 12),
('Cuidado de plantas', 'Mantenimiento de plantas de interior', 60, 12),
('Organización del hogar', 'Ordenamiento de espacios', 180, 12),
('Preparación de comidas', 'Cocina doméstica', 120, 12),
('Cuidado de niños', 'Niñera domiciliaria', 240, 12),
('Compras domésticas', 'Servicio de mandados', 90, 12),
('Limpieza de cocina', 'Limpieza especializada de cocina', 90, 12),
('Mantenimiento de electrodomésticos', 'Cuidado de aparatos', 60, 12),

-- Tipo 13: Servicios Integrales
('Mantenimiento integral', 'Servicio completo de mantenimiento', 360, 13),
('Administración de propiedades', 'Gestión integral de inmuebles', 240, 13),
('Servicios de conserjería', 'Atención integral de edificios', 480, 13),
('Gestión de proveedores', 'Coordinación de servicios', 180, 13),
('Supervisión de obras', 'Control de trabajos', 300, 13),
('Facility management', 'Gestión de instalaciones', 480, 13),
('Control de calidad', 'Supervisión de servicios', 120, 13),
('Coordinación logística', 'Organización de recursos', 180, 13),
('Gestión de mantenimiento', 'Planificación de servicios', 240, 13),
('Auditoría de servicios', 'Evaluación de calidad', 180, 13),

-- Tipo 14: Hogar y Jardín
('Mantenimiento de piscinas básico', 'Limpieza y químicos básicos de piscina', 120, 14),
('Jardinería y limpieza', 'Servicio combinado exterior', 240, 14),
('Cuidado de mascotas', 'Atención de animales domésticos', 180, 14),
('Limpieza de patios exterior', 'Mantenimiento de espacios externos', 150, 14),
('Decoración exterior', 'Ambientación de jardines', 180, 14),
('Mantenimiento de deck piscina', 'Cuidado de solarium', 120, 14),
('Limpieza de barbacoas', 'Mantenimiento de parrillas', 90, 14),
('Cuidado de plantas exterior', 'Mantenimiento de jardines', 120, 14),
('Instalación de pérgolas jardín', 'Estructuras para jardín', 300, 14),
('Mantenimiento de senderos', 'Cuidado de caminos', 150, 14),

-- Tipo 15: Servicios Inmobiliarios
('Tasaciones', 'Valuación de propiedades', 120, 15),
('Gestión de alquileres', 'Administración de contratos', 180, 15),
('Asesoramiento inmobiliario', 'Consultoría en propiedades', 90, 15),
('Mantenimiento de edificios inmobiliario', 'Gestión de consorcios', 300, 15),
('Inspecciones técnicas', 'Revisión de propiedades', 150, 15),
('Administración de consorcios', 'Gestión de edificios', 240, 15),
('Compra venta asesoramiento', 'Intermediación inmobiliaria', 120, 15),
('Gestión de seguros', 'Administración de pólizas', 90, 15),
('Marketing inmobiliario', 'Promoción de propiedades', 180, 15),
('Due diligence inmobiliaria', 'Análisis de propiedades', 240, 15),

-- Tipo 16: Limpieza Industrial
('Limpieza de oficinas industrial', 'Limpieza comercial', 180, 16),
('Limpieza de fábricas', 'Limpieza industrial especializada', 360, 16),
('Desinfección industrial', 'Sanitización de espacios', 180, 16),
('Limpieza de conductos', 'Mantenimiento de ventilación', 240, 16),
('Limpieza post construcción industrial', 'Limpieza de obra gruesa', 300, 16),
('Limpieza de maquinaria', 'Mantenimiento de equipos', 240, 16),
('Limpieza de depósitos', 'Mantenimiento de almacenes', 300, 16),
('Limpieza de hospitales', 'Sanitización médica', 240, 16),
('Limpieza de laboratorios', 'Limpieza especializada', 180, 16),
('Limpieza de restaurantes', 'Sanitización gastronómica', 150, 16),

-- Tipo 17: Control de Plagas
('Fumigación residencial', 'Control de plagas en hogar', 120, 17),
('Fumigación comercial', 'Tratamiento de locales', 180, 17),
('Control de roedores básico', 'Eliminación de ratones y ratas', 90, 17),
('Tratamiento de termitas', 'Control de insectos xilófagos', 240, 17),
('Desinsectación', 'Eliminación de insectos varios', 150, 17),
('Control de cucarachas', 'Eliminación específica', 120, 17),
('Fumigación de jardines', 'Control de plagas exteriores', 180, 17),
('Control de hormigas', 'Eliminación de colonias', 90, 17),
('Tratamiento de pulgas', 'Control en mascotas', 60, 17),
('Fumigación preventiva', 'Tratamiento preventivo', 120, 17),

-- Tipo 18: Mantenimiento Integral
('Mantenimiento preventivo integral', 'Revisiones programadas', 240, 18),
('Mantenimiento correctivo', 'Reparaciones urgentes', 180, 18),
('Mantenimiento de jardines integral', 'Cuidado de espacios verdes', 240, 18),
('Mantenimiento de instalaciones', 'Revisión de sistemas', 300, 18),
('Mantenimiento de equipos industriales', 'Servicio de maquinarias', 360, 18),
('Mantenimiento de ascensores', 'Servicio de elevadores', 120, 18),
('Mantenimiento de piscinas integral', 'Cuidado completo', 180, 18),
('Mantenimiento eléctrico', 'Revisión de instalaciones', 150, 18),
('Mantenimiento de aires', 'Servicio de climatización', 120, 18),
('Mantenimiento de bombas', 'Servicio de equipos', 150, 18),

-- Tipo 19: Servicios de Piscinas
('Limpieza de piscinas especializada', 'Mantenimiento semanal', 90, 19),
('Tratamiento químico', 'Balanceado de pH y cloro', 60, 19),
('Reparación de equipos piscina', 'Arreglo de bombas y filtros', 180, 19),
('Construcción de piscinas', 'Obras de piscinas nuevas', 2400, 19),
('Mantenimiento de deck piscinas', 'Cuidado de solarium', 120, 19),
('Instalación de equipos', 'Montaje de sistemas', 240, 19),
('Reparación de revestimientos', 'Arreglo de azulejos', 180, 19),
('Winterización de piscinas', 'Preparación para invierno', 120, 19),
('Instalación de iluminación', 'Luces para piscinas', 180, 19),
('Climatización de piscinas', 'Calefacción de agua', 240, 19),

-- Tipo 20: Decoración Interior
('Diseño de interiores', 'Planificación de espacios', 240, 20),
('Decoración de ambientes', 'Ambientación de espacios', 180, 20),
('Instalación de cortinas decoración', 'Colocación de cortinados', 120, 20),
('Pintura artística decorativa', 'Técnicas especiales de pintura', 300, 20),
('Asesoramiento en decoración', 'Consultoría en diseño', 90, 20),
('Instalación de pisos decorativos', 'Revestimientos especiales', 360, 20),
('Decoración de eventos', 'Ambientación temporal', 180, 20),
('Iluminación decorativa', 'Diseño de luminarias', 240, 20),
('Tapicería decorativa', 'Renovación de muebles', 180, 20),
('Decoración de jardines', 'Ambientación exterior', 240, 20),

-- Tipo 21: Refrigeración
('Reparación de heladeras', 'Arreglo de refrigeradores', 150, 21),
('Instalación de cámaras frías', 'Montaje de equipos industriales', 360, 21),
('Mantenimiento de congeladores', 'Servicio de congeladores', 120, 21),
('Reparación de aires refrigeración', 'Arreglo de equipos de clima', 180, 21),
('Instalación de sistemas refrigeración', 'Montaje de climatización', 240, 21),
('Carga de gas equipos', 'Recarga de refrigerantes', 60, 21),
('Reparación de vitrinas', 'Arreglo de exhibidores', 120, 21),
('Mantenimiento de compresores', 'Servicio de equipos', 150, 21),
('Instalación de termostatos refrigeración', 'Control de temperatura', 90, 21),
('Reparación de equipos industriales', 'Servicio especializado', 240, 21),

-- Tipo 22: Tecnología y Automatización
('Instalación de domótica', 'Automatización del hogar', 360, 22),
('Configuración de alarmas', 'Sistemas de seguridad', 180, 22),
('Instalación de cámaras seguridad', 'Sistemas de videovigilancia', 240, 22),
('Redes informáticas', 'Instalación de conectividad', 300, 22),
('Sistemas inteligentes', 'IoT y automatización', 360, 22),
('Control de accesos', 'Sistemas biométricos', 180, 22),
('Automatización industrial', 'Sistemas de control', 480, 22),
('Instalación de sensores', 'Monitoreo automatizado', 120, 22),
('Configuración de routers', 'Equipos de red', 90, 22),
('Mantenimiento de sistemas', 'Soporte tecnológico', 150, 22),

-- Tipo 23: Seguridad del Hogar
('Instalación de alarmas', 'Sistemas de seguridad básicos', 180, 23),
('Monitoreo de seguridad', 'Vigilancia remota', 480, 23),
('Instalación de cámaras IP', 'Videovigilancia digital', 240, 23),
('Sistemas de acceso biométrico', 'Control de ingresos', 240, 23),
('Consultoría en seguridad', 'Asesoramiento especializado', 120, 23),
('Instalación de sensores movimiento', 'Detección de intrusos', 90, 23),
('Sistemas de iluminación seguridad', 'Iluminación automatizada', 150, 23),
('Control remoto seguridad', 'Monitoreo a distancia', 120, 23),
('Blindaje ejecutivo vehicular', 'Protección física para vehículos ejecutivos', 300, 23),
('Mantenimiento de alarmas', 'Servicio de sistemas', 90, 23);

-- 6. INSERTAR RELACIONES USUARIO-TIPOS DE SERVICIO (cada prestador mínimo 3 tipos similares)
INSERT INTO `usuario_tipos_de_servicio` (`usuario_id`, `tipo_servicio_id`) VALUES
-- Prestador 46: Limpieza Total - Servicios de limpieza
(46, 1),  -- Limpieza Residencial
(46, 12), -- Servicios del Hogar
(46, 16), -- Limpieza Industrial

-- Prestador 47: Plomería Herrera - Servicios de plomería
(47, 2),  -- Plomería
(47, 10), -- Reparaciones Generales
(47, 9),  -- Climatización

-- Prestador 48: Electricidad Ramírez - Servicios eléctricos
(48, 3),  -- Electricidad
(48, 22), -- Tecnología y Automatización
(48, 23), -- Seguridad del Hogar

-- Prestador 49: Jardines Vega - Servicios de jardinería
(49, 4),  -- Jardinería
(49, 14), -- Hogar y Jardín

-- Prestador 50: Pintura Moreno - Servicios de pintura
(50, 5),  -- Pintura
(50, 20), -- Decoración Interior
(50, 10), -- Reparaciones Generales

-- Prestador 51: Carpintería Ruiz - Trabajos en madera
(51, 6),  -- Carpintería
(51, 7),  -- Construcción

-- Prestador 52: Construcciones Díaz - Construcción y obras
(52, 7),  -- Construcción
(52, 18), -- Mantenimiento Integral

-- Prestador 53: Cerrajería Flores - Seguridad
(53, 8),  -- Cerrajería
(53, 23), -- Seguridad del Hogar
(53, 10), -- Reparaciones Generales

-- Prestador 54: Clima Service - Climatización
(54, 9),  -- Climatización
(54, 21), -- Refrigeración
(54, 18), -- Mantenimiento Integral

-- Prestador 55: Reparaciones Express - Reparaciones
(55, 10), -- Reparaciones Generales
(55, 11), -- Servicios Técnicos
(55, 12), -- Servicios del Hogar

-- Prestador 56: Técnicos García - Servicios técnicos
(56, 11), -- Servicios Técnicos
(56, 22), -- Tecnología y Automatización

-- Prestador 57: Mantenimientos López - Mantenimiento
(57, 18), -- Mantenimiento Integral
(57, 13), -- Servicios Integrales
(57, 15), -- Servicios Inmobiliarios

-- Prestador 58: Servicios del Hogar Martín - Hogar
(58, 12), -- Servicios del Hogar
(58, 1),  -- Limpieza Residencial
(58, 14), -- Hogar y Jardín

-- Prestador 59: Servicios Integrales Torres - Integrales
(59, 13), -- Servicios Integrales
(59, 18), -- Mantenimiento Integral
(59, 15), -- Servicios Inmobiliarios

-- Prestador 60: Hogar y Jardín Vera - Hogar y jardín
(60, 14), -- Hogar y Jardín
(60, 4),  -- Jardinería
(60, 19), -- Servicios de Piscinas

-- Prestador 61: Servicios Inmobiliarios Castro - Inmobiliarios
(61, 15), -- Servicios Inmobiliarios
(61, 13), -- Servicios Integrales
(61, 18), -- Mantenimiento Integral

-- Prestador 62: Multi-Servicios Peña - Múltiples servicios
(62, 16), -- Limpieza Industrial
(62, 17), -- Control de Plagas
(62, 18), -- Mantenimiento Integral

-- Prestador 63: Servicios Profesionales Ortega - Servicios profesionales
(63, 11), -- Servicios Técnicos
(63, 13), -- Servicios Integrales

-- Prestador 64: Servicios Especializados Silva - Especializados
(64, 17), -- Control de Plagas
(64, 16), -- Limpieza Industrial
(64, 18), -- Mantenimiento Integral

-- Prestador 65: Pintura Profesional - Pintura especializada
(65, 5),  -- Pintura
(65, 20), -- Decoración Interior
(65, 7),  -- Construcción

-- Prestador 67: Belleza Total - Estética
(67, 12), -- Servicios del Hogar

-- Prestador 68: Desarrollo Personal - Coaching cambiado a Servicios del Hogar
(68, 12), -- Servicios del Hogar

-- Prestador 69: Idiomas Profesionales - cambiado a Servicios del Hogar
(69, 12), -- Servicios del Hogar

-- Prestador 70: Code Solutions - cambiado a Tecnología
(70, 22), -- Tecnología y Automatización
(70, 11), -- Servicios Técnicos

-- Prestador 71: Digital Growth - cambiado a Servicios del Hogar
(71, 12), -- Servicios del Hogar

-- Prestador 72: Diseños Arquitectónicos - cambiado a Construcción
(72, 7),  -- Construcción
(72, 20), -- Decoración Interior

-- Prestador 73: Servicios Legales Integrales - Legal
(73, 15), -- Servicios Inmobiliarios

-- Prestador 74: Bienestar Mental - cambiado a Estética
(74, 12), -- Servicios del Hogar

-- Prestador 75: Nutrición Pro - cambiado a Estética
(75, 12); -- Servicios del Hogar

-- 7. INSERTAR USUARIO-ZONAS (cada prestador en al menos 2 zonas)
INSERT INTO `usuario_zonas` (`usuario_id`, `zona_id`) VALUES
-- Prestadores en múltiples zonas
(46, 1), (46, 2), -- Limpieza Total: Centro, Norte
(47, 1), (47, 3), -- Plomería Herrera: Centro, Sur
(48, 2), (48, 4), -- Electricidad Ramírez: Norte, Este
(49, 3), (49, 5), -- Jardines Vega: Sur, Oeste
(50, 4), (50, 1), -- Pintura Moreno: Este, Centro
(51, 5), (51, 2), -- Carpintería Ruiz: Oeste, Norte
(52, 1), (52, 3), -- Construcciones Díaz: Centro, Sur
(53, 1), (53, 2), (53, 3), (53, 4), (53, 5), -- Cerrajería Flores: Todas las zonas (24hs)
(54, 2), (54, 4), -- Clima Service: Norte, Este
(55, 3), (55, 5), -- Reparaciones Express: Sur, Oeste
(56, 4), (56, 1), -- Técnicos García: Este, Centro
(57, 5), (57, 2), -- Mantenimientos López: Oeste, Norte
(58, 1), (58, 3), -- Servicios del Hogar Martín: Centro, Sur
(59, 2), (59, 4), -- Servicios Integrales Torres: Norte, Este
(60, 3), (60, 5), -- Hogar y Jardín Vera: Sur, Oeste
(61, 1), (61, 4), -- Servicios Inmobiliarios Castro: Centro, Este
(62, 2), (62, 5), -- Multi-Servicios Peña: Norte, Oeste
(63, 3), (63, 1), -- Servicios Profesionales Ortega: Sur, Centro
(64, 4), (64, 2), -- Servicios Especializados Silva: Este, Norte
(65, 5), (65, 3), -- Pintura Profesional: Oeste, Sur
(67, 1), (67, 4), -- Belleza Total: Centro, Este
(68, 2), (68, 5), -- Desarrollo Personal: Norte, Oeste
(69, 1), (69, 3), -- Idiomas Profesionales: Centro, Sur
(70, 4), (70, 2), -- Code Solutions: Este, Norte
(71, 5), (71, 1), -- Digital Growth: Oeste, Centro
(72, 3), (72, 4), -- Diseños Arquitectónicos: Sur, Este
(73, 1), (73, 5), -- Servicios Legales Integrales: Centro, Oeste
(74, 2), (74, 3), -- Bienestar Mental: Norte, Sur
(75, 4), (75, 1); -- Nutrición Pro: Este, Centro

-- 8. INSERTAR SERVICIOS (cada prestador mínimo 3 tareas de cada tipo de servicio que ofrece)
INSERT INTO `servicio` (`precio`, `tarea_id`, `usuario_id`) VALUES
-- Prestador 46 (Limpieza Total) - Tipos: 1, 12, 16
-- Tipo 1: Limpieza Residencial
(8000, 1, 46),   -- Limpieza básica de hogar
(12000, 2, 46),  -- Limpieza profunda
(15000, 3, 46),  -- Limpieza post obra
-- Tipo 12: Servicios del Hogar
(10000, 111, 46), -- Limpieza doméstica
(6000, 112, 46),  -- Lavado de ropa
(4000, 113, 46),  -- Planchado
-- Tipo 16: Limpieza Industrial
(12000, 151, 46), -- Limpieza de oficinas industrial
(18000, 152, 46), -- Limpieza de fábricas
(10000, 153, 46), -- Desinfección industrial-- Prestador 47 (Plomería Herrera) - Tipos: 2, 10, 9
-- Tipo 2: Plomería
(4000, 11, 47),   -- Reparación de canillas
(6000, 12, 47),   -- Destapado de cañerías
(8000, 13, 47),   -- Instalación de inodoro
-- Tipo 10: Reparaciones Generales
(5000, 91, 47),   -- Reparaciones menores
(8000, 92, 47),   -- Arreglo de electrodomésticos
(6000, 93, 47),   -- Reparación de muebles
-- Tipo 9: Climatización
(15000, 81, 47),  -- Instalación de aire acondicionado
(5000, 82, 47),   -- Mantenimiento de AA
(8000, 83, 47),   -- Reparación de calefacción

-- Prestador 48 (Electricidad Ramírez) - Tipos: 3, 22, 23
-- Tipo 3: Electricidad
(3000, 21, 48),   -- Instalación de tomas
(20000, 22, 48),  -- Cambio de tablero eléctrico
(4000, 23, 48),   -- Reparación de iluminación
-- Tipo 22: Tecnología y Automatización
(25000, 211, 48), -- Instalación de domótica
(12000, 212, 48), -- Configuración de alarmas
(15000, 213, 48), -- Instalación de cámaras seguridad
-- Tipo 23: Seguridad del Hogar
(12000, 221, 48), -- Instalación de alarmas
(30000, 222, 48), -- Monitoreo de seguridad
(15000, 223, 48), -- Instalación de cámaras IP

-- Prestador 49 (Jardines Vega) - Tipos: 4, 14
-- Tipo 4: Jardinería
(3000, 31, 49),   -- Corte de césped
(8000, 32, 49),   -- Poda de árboles
(5000, 33, 49),   -- Plantación de flores
-- Tipo 14: Hogar y Jardín
(8000, 131, 49),  -- Mantenimiento de piscinas básico
(15000, 132, 49), -- Jardinería y limpieza
(10000, 133, 49), -- Cuidado de mascotas

-- Prestador 50 (Pintura Moreno) - Tipos: 5, 20, 10
-- Tipo 5: Pintura
(20000, 41, 50),  -- Pintura interior
(25000, 42, 50),  -- Pintura exterior
(12000, 43, 50),  -- Empapelado
-- Tipo 20: Decoración Interior
(15000, 191, 50), -- Diseño de interiores
(12000, 192, 50), -- Decoración de ambientes
(8000, 193, 50),  -- Instalación de cortinas decoración
-- Tipo 10: Reparaciones Generales
(5000, 94, 50),   -- Instalación de accesorios
(8000, 95, 50),   -- Mantenimiento preventivo
(6000, 96, 50),   -- Reparación de ventanas

-- Prestador 51 (Carpintería Ruiz) - Tipos: 6, 7, 20
-- Tipo 6: Carpintería
(45000, 51, 51),  -- Fabricación de muebles
(8000, 52, 51),   -- Reparación de puertas
(5000, 53, 51),   -- Instalación de estantes
-- Tipo 7: Construcción
(30000, 61, 51),  -- Construcción de paredes
(25000, 62, 51),  -- Instalación de pisos
(20000, 63, 51),  -- Reparación de techos
-- Tipo 20: Decoración Interior
(25000, 194, 51), -- Pintura artística decorativa
(6000, 195, 51),  -- Asesoramiento en decoración
(30000, 196, 51), -- Instalación de pisos decorativos

-- Prestador 52 (Construcciones Díaz) - Tipos: 7, 18
-- Tipo 7: Construcción
(50000, 64, 52),  -- Construcción de baños
(8000, 65, 52),   -- Refacciones menores
(40000, 66, 52),  -- Construcción de cocinas
-- Tipo 18: Mantenimiento Integral
(15000, 171, 52), -- Mantenimiento preventivo integral
(10000, 172, 52), -- Mantenimiento correctivo
(20000, 173, 52), -- Mantenimiento de jardines integral

-- Prestador 53 (Cerrajería Flores) - Tipos: 8, 23, 10
-- Tipo 8: Cerrajería
(4000, 71, 53),   -- Cambio de cerraduras
(3000, 72, 53),   -- Apertura de cerraduras
(15000, 73, 53),  -- Instalación de rejas
-- Tipo 23: Seguridad del Hogar
(12000, 224, 53), -- Sistemas de acceso biométrico
(8000, 225, 53),  -- Consultoría en seguridad
(5000, 226, 53),  -- Instalación de sensores movimiento
-- Tipo 10: Reparaciones Generales
(6000, 97, 53),   -- Reparación de escaleras
(5000, 98, 53),   -- Instalación de cortinas
(6000, 99, 53),   -- Reparación de azulejos

-- Prestador 54 (Clima Service) - Tipos: 9, 21, 18
-- Tipo 9: Climatización
(18000, 84, 54),  -- Instalación de ventilación
(4000, 85, 54),   -- Carga de gas refrigerante
(35000, 86, 54),  -- Instalación de calefacción central
-- Tipo 21: Refrigeración
(12000, 201, 54), -- Reparación de heladeras
(40000, 202, 54), -- Instalación de cámaras frías
(8000, 203, 54),  -- Mantenimiento de congeladores
-- Tipo 18: Mantenimiento Integral
(12000, 174, 54), -- Mantenimiento de instalaciones
(25000, 175, 54), -- Mantenimiento de equipos industriales
(8000, 176, 54),  -- Mantenimiento de ascensores

-- Prestador 55 (Reparaciones Express) - Tipos: 10, 11, 12
-- Tipo 10: Reparaciones Generales
(8000, 100, 55),  -- Mantenimiento de balcones
(5000, 91, 55),   -- Reparaciones menores
(8000, 92, 55),   -- Arreglo de electrodomésticos
-- Tipo 11: Servicios Técnicos
(8000, 101, 55),  -- Reparación de PC
(12000, 102, 55), -- Instalación de redes
(10000, 103, 55), -- Mantenimiento de equipos
-- Tipo 12: Servicios del Hogar
(15000, 114, 55), -- Cuidado de plantas
(12000, 115, 55), -- Organización del hogar
(8000, 116, 55),  -- Preparación de comidas

-- Prestador 56 (Técnicos García) - Tipos: 11, 22
-- Tipo 11: Servicios Técnicos
(6000, 104, 56),  -- Configuración de sistemas
(4000, 105, 56),  -- Soporte técnico general
(5000, 106, 56),  -- Instalación de software
-- Tipo 22: Tecnología y Automatización
(20000, 214, 56), -- Redes informáticas
(25000, 215, 56), -- Sistemas inteligentes
(12000, 216, 56), -- Control de accesos

-- Prestador 42 (Mantenimientos López) - Tipos: 18, 13, 15
-- Tipo 18: Mantenimiento Integral
(12000, 177, 70), -- Mantenimiento de piscinas integral
(10000, 178, 70), -- Mantenimiento eléctrico
(8000, 179, 70),  -- Mantenimiento de aires
-- Tipo 13: Servicios Integrales
(25000, 121, 70), -- Mantenimiento integral
(20000, 122, 70), -- Administración de propiedades
(30000, 123, 70), -- Servicios de conserjería
-- Tipo 15: Servicios Inmobiliarios
(8000, 141, 70),  -- Tasaciones
(15000, 142, 70), -- Gestión de alquileres
(6000, 143, 70),  -- Asesoramiento inmobiliario

-- Prestador 43 (Servicios del Hogar Martín) - Tipos: 12, 1, 14
-- Tipo 12: Servicios del Hogar
(15000, 117, 71), -- Cuidado de niños
(5000, 118, 71),  -- Compras domésticas
(6000, 119, 71),  -- Limpieza de cocina
-- Tipo 1: Limpieza Residencial
(5000, 4, 71),    -- Limpieza de alfombras
(4000, 5, 71),    -- Limpieza de vidrios
(12000, 6, 71),   -- Limpieza de techos
-- Tipo 14: Hogar y Jardín
(10000, 134, 71), -- Limpieza de patios exterior
(12000, 135, 71), -- Decoración exterior
(8000, 136, 71),  -- Mantenimiento de deck piscina

-- Prestador 44 (Servicios Integrales Torres) - Tipos: 13, 18, 15
-- Tipo 13: Servicios Integrales
(12000, 124, 72), -- Gestión de proveedores
(20000, 125, 72), -- Supervisión de obras
(30000, 126, 72), -- Facility management
-- Tipo 18: Mantenimiento Integral
(10000, 180, 72), -- Mantenimiento de bombas
(15000, 171, 72), -- Mantenimiento preventivo integral
(10000, 172, 72), -- Mantenimiento correctivo
-- Tipo 15: Servicios Inmobiliarios
(20000, 144, 72), -- Mantenimiento de edificios inmobiliario
(10000, 145, 72), -- Inspecciones técnicas
(15000, 146, 72), -- Administración de consorcios

-- Prestador 45 (Hogar y Jardín Vera) - Tipos: 14, 4, 19
-- Tipo 14: Hogar y Jardín
(6000, 137, 73),  -- Limpieza de barbacoas
(8000, 138, 73),  -- Cuidado de plantas exterior
(20000, 139, 73), -- Instalación de pérgolas jardín
-- Tipo 4: Jardinería
(12000, 34, 73),  -- Diseño de jardín básico
(15000, 35, 73),  -- Riego automático
(6000, 36, 73),   -- Mantenimiento de césped
-- Tipo 19: Servicios de Piscinas
(6000, 181, 73),  -- Limpieza de piscinas especializada
(4000, 182, 73),  -- Tratamiento químico
(12000, 183, 73), -- Reparación de equipos piscina

-- Prestador 46 (Servicios Inmobiliarios Castro) - Tipos: 15, 13, 18
-- Tipo 15: Servicios Inmobiliarios
(8000, 147, 46),  -- Compra venta asesoramiento
(5000, 148, 46),  -- Gestión de seguros
(12000, 149, 46), -- Marketing inmobiliario
-- Tipo 13: Servicios Integrales
(8000, 127, 46),  -- Control de calidad
(12000, 128, 46), -- Coordinación logística
(15000, 129, 46), -- Gestión de mantenimiento
-- Tipo 18: Mantenimiento Integral
(20000, 173, 46), -- Mantenimiento de jardines integral
(12000, 174, 46), -- Mantenimiento de instalaciones
(8000, 176, 46),  -- Mantenimiento de ascensores

-- Prestador 47 (Multi-Servicios Peña) - Tipos: 16, 17, 18
-- Tipo 16: Limpieza Industrial
(15000, 154, 47), -- Limpieza de conductos
(20000, 155, 47), -- Limpieza post construcción industrial
(15000, 156, 47), -- Limpieza de maquinaria
-- Tipo 17: Control de Plagas
(8000, 161, 47),  -- Fumigación residencial
(12000, 162, 47), -- Fumigación comercial
(6000, 163, 47),  -- Control de roedores básico
-- Tipo 18: Mantenimiento Integral
(25000, 175, 47), -- Mantenimiento de equipos industriales
(15000, 171, 47), -- Mantenimiento preventivo integral
(10000, 172, 47), -- Mantenimiento correctivo

-- Prestador 63 (Servicios Profesionales Ortega) - Tipos: 11, 13
-- Tipo 11: Servicios Técnicos
(8000, 107, 63),  -- Reparación de tablets
(4000, 108, 63),  -- Configuración de impresoras
(12000, 109, 63), -- Mantenimiento de servidores
-- Tipo 13: Servicios Integrales
(12000, 130, 63), -- Auditoría de servicios
(25000, 121, 63), -- Mantenimiento integral
(20000, 122, 63), -- Administración de propiedades

-- Prestador 49 (Servicios Especializados Silva) - Tipos: 17, 16, 18
-- Tipo 17: Control de Plagas
(15000, 164, 50), -- Tratamiento de termitas
(10000, 165, 50), -- Desinsectación
(8000, 166, 50),  -- Control de cucarachas
-- Tipo 16: Limpieza Industrial
(20000, 157, 50), -- Limpieza de depósitos
(15000, 158, 50), -- Limpieza de hospitales
(12000, 159, 50), -- Limpieza de laboratorios
-- Tipo 18: Mantenimiento Integral
(20000, 173, 50), -- Mantenimiento de jardines integral
(12000, 174, 50), -- Mantenimiento de instalaciones
(10000, 172, 50), -- Mantenimiento correctivo

-- Prestador 50 (Pintura Profesional) - Tipos: 5, 20, 7
-- Tipo 5: Pintura
(15000, 46, 51),  -- Pintura de techos
(12000, 47, 51),  -- Pintura de rejas
(20000, 48, 51),  -- Pintura artística
-- Tipo 20: Decoración Interior
(12000, 197, 51), -- Decoración de eventos
(15000, 198, 51), -- Iluminación decorativa
(12000, 199, 51), -- Tapicería decorativa
-- Tipo 7: Construcción
(15000, 67, 51),  -- Impermeabilización
(30000, 68, 51),  -- Construcción de quinchos
(25000, 69, 51),  -- Reparación de cimientos

-- Prestador 67 (Belleza Total) - Tipo: 12
-- Tipo 12: Servicios del Hogar
(4000, 116, 67),  -- Preparación de comidas
(8000, 115, 67),  -- Organización del hogar
(6000, 114, 67),  -- Cuidado de plantas
-- Tipo 12: Servicios del Hogar
(10000, 120, 67), -- Mantenimiento de electrodomésticos
(12000, 115, 67), -- Organización del hogar
(8000, 116, 67),  -- Preparación de comidas

-- Prestador 68 (Desarrollo Personal cambiado a Servicios del Hogar) - Tipo: 12
-- Tipo 12: Servicios del Hogar
(12000, 115, 68), -- Organización del hogar
(8000, 116, 68),  -- Preparación de comidas
(15000, 117, 68), -- Cuidado de niños

-- Prestador 69 (Idiomas Profesionales cambiado a Servicios del Hogar) - Tipo: 12  
-- Tipo 12: Servicios del Hogar
(10000, 111, 69), -- Limpieza doméstica
(6000, 112, 69),  -- Lavado de ropa
(4000, 113, 69),  -- Planchado

-- Prestador 71 (Digital Growth cambiado a Servicios del Hogar) - Tipo: 12
-- Tipo 12: Servicios del Hogar
(15000, 114, 71), -- Cuidado de plantas
(12000, 115, 71), -- Organización del hogar
(10000, 120, 71), -- Mantenimiento de electrodomésticos

-- Prestador 70 (Code Solutions cambiado a Tecnología) - Tipos: 22, 11
-- Tipo 22: Tecnología y Automatización
(35000, 217, 70), -- Automatización industrial
(8000, 218, 70),  -- Instalación de sensores
(6000, 219, 70),  -- Configuración de routers
-- Tipo 11: Servicios Técnicos
(18000, 110, 70), -- Recuperación de datos
(12000, 102, 70), -- Instalación de redes
(10000, 103, 70), -- Mantenimiento de equipos

-- Prestador 72 (Diseños Arquitectónicos cambiado a Construcción) - Tipos: 7, 20
-- Tipo 7: Construcción
(50000, 70, 72),  -- Construcción de garages
(30000, 61, 72),  -- Construcción de paredes
(25000, 62, 72),  -- Instalación de pisos
-- Tipo 20: Decoración Interior
(20000, 200, 72), -- Decoración de jardines
(15000, 191, 72), -- Diseño de interiores
(12000, 192, 72), -- Decoración de ambientes

-- Prestador 73 (Servicios Legales Integrales) - Tipo: 15
-- Tipo 15: Servicios Inmobiliarios
(18000, 150, 73), -- Due diligence inmobiliaria
(8000, 141, 73),  -- Tasaciones
(6000, 143, 73),  -- Asesoramiento inmobiliario

-- Prestador 74 (Bienestar Mental cambiado a Estética) - Tipo: 12
-- Tipo 12: Servicios del Hogar
(6000, 118, 74),  -- Compras domésticas
(8000, 117, 74),  -- Cuidado de niños
(6000, 119, 74),  -- Limpieza de cocina
-- Tipo 12: Servicios del Hogar
(12000, 115, 74), -- Organización del hogar
(8000, 114, 74),  -- Cuidado de plantas
(15000, 117, 74), -- Cuidado de niños

-- Prestador 75 (Nutrición Pro cambiado a Estética) - Tipo: 12
-- Tipo 12: Servicios del Hogar
(8000, 111, 75),  -- Limpieza doméstica
(6000, 112, 75),  -- Lavado de ropa
(6000, 113, 75);  -- Planchado

-- 9. INSERTAR TURNOS (mínimo 30 turnos por cliente = 900 turnos)
-- Turnos desde 13/07/2025 en adelante
-- Los anteriores a hoy (13/08/2025): cancelados o completados
-- Los posteriores: confirmados, cancelados o pendientes
INSERT INTO `turno` VALUES (1,'2025-07-15 09:00:00','completado',5,'Excelente servicio de limpieza',8000,1,1),(2,'2025-07-16 14:00:00','completado',NULL,NULL,12600,7,1),(3,'2025-07-18 10:30:00','completado',4,'Buen trabajo',6000,8,1),(4,'2025-07-20 16:00:00','cancelado',NULL,NULL,12600,2,1),(5,'2025-07-22 11:00:00','completado',NULL,NULL,10500,9,1),(6,'2025-07-25 09:30:00','completado',5,'Muy profesional',12000,2,1),(7,'2025-07-28 15:00:00','cancelado',NULL,NULL,15750,3,1),(8,'2025-07-30 10:00:00','completado',NULL,NULL,8400,1,1),(9,'2025-08-02 14:30:00','completado',4,'Trabajo satisfactorio',10000,7,1),(10,'2025-08-05 09:00:00','completado',NULL,NULL,18900,8,1),(11,'2025-08-08 16:00:00','cancelado',NULL,NULL,10500,9,1),(12,'2025-08-12 11:30:00','completado',5,'Perfecto',15000,3,1),(13,'2025-08-15 10:00:00','confirmado',NULL,NULL,8400,1,1),(14,'2025-08-18 14:00:00','pendiente',NULL,NULL,12600,2,1),(15,'2025-08-22 09:30:00','confirmado',NULL,NULL,12600,7,1),(16,'2025-08-25 16:00:00','cancelado',NULL,NULL,18900,8,1),(17,'2025-08-28 11:00:00','pendiente',NULL,NULL,10500,9,1),(18,'2025-09-02 10:30:00','confirmado',NULL,NULL,15750,3,1),(19,'2025-09-05 15:00:00','pendiente',NULL,NULL,8400,1,1),(20,'2025-09-08 09:00:00','confirmado',NULL,NULL,12600,2,1),(21,'2025-09-12 14:30:00','cancelado',NULL,NULL,12600,7,1),(22,'2025-09-15 10:00:00','pendiente',NULL,NULL,18900,8,1),(23,'2025-09-18 16:00:00','confirmado',NULL,NULL,10500,9,1),(24,'2025-09-22 11:30:00','pendiente',NULL,NULL,15750,3,1),(25,'2025-09-25 09:00:00','confirmado',NULL,NULL,8400,1,1),(26,'2025-09-28 14:00:00','cancelado',NULL,NULL,12600,2,1),(27,'2025-10-02 10:30:00','pendiente',NULL,NULL,12600,7,1),(28,'2025-10-05 15:00:00','confirmado',NULL,NULL,18900,8,1),(29,'2025-10-08 09:30:00','pendiente',NULL,NULL,10500,9,1),(30,'2025-10-12 16:00:00','confirmado',NULL,NULL,15750,3,1),(31,'2025-07-14 08:00:00','completado',4,'Buen servicio de plomería',4000,10,2),(32,'2025-07-17 13:00:00','completado',NULL,NULL,6300,11,2),(33,'2025-07-19 09:30:00','cancelado',NULL,NULL,8400,12,2),(34,'2025-07-21 15:00:00','completado',5,'Excelente trabajo',6000,13,2),(35,'2025-07-24 10:00:00','completado',NULL,NULL,8400,14,2),(36,'2025-07-26 16:30:00','completado',4,'Profesional',8000,15,2),(37,'2025-07-29 11:00:00','cancelado',NULL,NULL,4200,10,2),(38,'2025-08-01 14:00:00','completado',NULL,NULL,6300,11,2),(39,'2025-08-04 09:00:00','completado',5,'Muy bueno',15000,15,2),(40,'2025-08-07 16:00:00','cancelado',NULL,NULL,8400,12,2),(41,'2025-08-10 10:30:00','completado',NULL,NULL,5250,13,2),(42,'2025-08-13 15:00:00','completado',4,'Satisfactorio',5000,14,2),(43,'2025-08-16 09:00:00','confirmado',NULL,NULL,4200,10,2),(44,'2025-08-19 14:30:00','pendiente',NULL,NULL,6300,11,2),(45,'2025-08-23 10:00:00','cancelado',NULL,NULL,8400,12,2),(46,'2025-08-26 16:00:00','confirmado',NULL,NULL,5250,13,2),(47,'2025-08-30 11:30:00','pendiente',NULL,NULL,8400,14,2),(48,'2025-09-03 09:00:00','confirmado',NULL,NULL,6300,15,2),(49,'2025-09-06 15:00:00','cancelado',NULL,NULL,4200,10,2),(50,'2025-09-09 10:30:00','pendiente',NULL,NULL,6300,11,2),(51,'2025-09-13 14:00:00','confirmado',NULL,NULL,8400,12,2),(52,'2025-09-16 09:30:00','pendiente',NULL,NULL,5250,13,2),(53,'2025-09-20 16:00:00','cancelado',NULL,NULL,8400,14,2),(54,'2025-09-23 11:00:00','confirmado',NULL,NULL,6300,15,2),(55,'2025-09-27 10:00:00','pendiente',NULL,NULL,4200,10,2),(56,'2025-09-30 15:30:00','confirmado',NULL,NULL,6300,11,2),(57,'2025-10-04 09:00:00','cancelado',NULL,NULL,8400,12,2),(58,'2025-10-07 14:00:00','pendiente',NULL,NULL,5250,13,2),(59,'2025-10-11 10:30:00','confirmado',NULL,NULL,8400,14,2),(60,'2025-10-14 16:00:00','pendiente',NULL,NULL,6300,15,2),(61,'2025-07-13 10:00:00','completado',5,'Excelente electricista',3000,19,3),(62,'2025-07-16 15:00:00','completado',NULL,NULL,21000,20,3),(63,'2025-07-18 11:30:00','cancelado',NULL,NULL,4200,21,3),(64,'2025-07-20 09:00:00','completado',4,'Buen trabajo',25000,22,3),(65,'2025-07-23 14:00:00','completado',NULL,NULL,12600,23,3),(66,'2025-07-25 16:30:00','completado',5,'Muy profesional',12000,24,3),(67,'2025-07-28 10:00:00','cancelado',NULL,NULL,12600,25,3),(68,'2025-07-31 13:00:00','completado',NULL,NULL,31500,26,3),(69,'2025-08-03 09:30:00','completado',4,'Satisfactorio',15000,27,3),(70,'2025-08-06 15:00:00','cancelado',NULL,NULL,3150,19,3),(71,'2025-08-09 11:00:00','completado',NULL,NULL,21000,20,3),(72,'2025-08-12 16:00:00','completado',5,'Perfecto',30000,22,3),(73,'2025-08-15 09:00:00','confirmado',NULL,NULL,4200,21,3),(74,'2025-08-18 14:30:00','pendiente',NULL,NULL,12600,23,3),(75,'2025-08-22 10:00:00','cancelado',NULL,NULL,15750,24,3),(76,'2025-08-25 16:00:00','confirmado',NULL,NULL,12600,25,3),(77,'2025-08-29 11:30:00','pendiente',NULL,NULL,31500,26,3),(78,'2025-09-02 09:00:00','confirmado',NULL,NULL,15750,27,3),(79,'2025-09-05 15:00:00','cancelado',NULL,NULL,3150,19,3),(80,'2025-09-08 10:30:00','pendiente',NULL,NULL,21000,20,3),(81,'2025-09-12 14:00:00','confirmado',NULL,NULL,4200,21,3),(82,'2025-09-15 09:30:00','pendiente',NULL,NULL,26250,22,3),(83,'2025-09-19 16:00:00','cancelado',NULL,NULL,12600,23,3),(84,'2025-09-22 11:00:00','confirmado',NULL,NULL,15750,24,3),(85,'2025-09-26 10:00:00','pendiente',NULL,NULL,12600,25,3),(86,'2025-09-29 15:30:00','confirmado',NULL,NULL,31500,26,3),(87,'2025-10-03 09:00:00','cancelado',NULL,NULL,15750,27,3),(88,'2025-10-06 14:00:00','pendiente',NULL,NULL,3150,19,3),(89,'2025-10-10 10:30:00','confirmado',NULL,NULL,21000,20,3),(90,'2025-10-13 16:00:00','pendiente',NULL,NULL,4200,21,3),(91,'2025-07-14 08:00:00','completado',4,'Buen servicio de jardinería',3000,28,4),(92,'2025-07-17 13:00:00','completado',NULL,NULL,8400,29,4),(93,'2025-07-19 09:30:00','cancelado',NULL,NULL,5250,30,4),(94,'2025-07-21 15:00:00','completado',5,'Excelente diseño',50000,31,4),(95,'2025-07-24 10:00:00','completado',NULL,NULL,15750,32,4),(96,'2025-07-26 16:30:00','completado',4,'Muy bueno',8000,33,4),(97,'2025-07-29 11:00:00','cancelado',NULL,NULL,21000,34,4),(98,'2025-08-01 14:00:00','completado',NULL,NULL,26250,35,4),(99,'2025-08-04 09:00:00','completado',5,'Perfecto',10000,36,4),(100,'2025-08-07 16:00:00','cancelado',NULL,NULL,3150,28,4),(101,'2025-08-10 10:30:00','completado',NULL,NULL,8400,29,4),(102,'2025-08-13 15:00:00','completado',4,'Satisfactorio',25000,32,4),(103,'2025-08-16 09:00:00','confirmado',NULL,NULL,5250,30,4),(104,'2025-08-19 14:30:00','pendiente',NULL,NULL,8400,31,4),(105,'2025-08-23 10:00:00','cancelado',NULL,NULL,10500,33,4),(106,'2025-08-26 16:00:00','confirmado',NULL,NULL,21000,34,4),(107,'2025-08-30 11:30:00','pendiente',NULL,NULL,26250,35,4),(108,'2025-09-03 09:00:00','confirmado',NULL,NULL,12600,36,4),(109,'2025-09-06 15:00:00','cancelado',NULL,NULL,3150,28,4),(110,'2025-09-09 10:30:00','pendiente',NULL,NULL,8400,29,4),(111,'2025-09-13 14:00:00','confirmado',NULL,NULL,5250,30,4),(112,'2025-09-16 09:30:00','pendiente',NULL,NULL,8400,31,4),(113,'2025-09-20 16:00:00','cancelado',NULL,NULL,15750,32,4),(114,'2025-09-23 11:00:00','confirmado',NULL,NULL,10500,33,4),(115,'2025-09-27 10:00:00','pendiente',NULL,NULL,21000,34,4),(116,'2025-09-30 15:30:00','confirmado',NULL,NULL,26250,35,4),(117,'2025-10-04 09:00:00','cancelado',NULL,NULL,12600,36,4),(118,'2025-10-07 14:00:00','pendiente',NULL,NULL,3150,28,4),(119,'2025-10-11 10:30:00','confirmado',NULL,NULL,8400,29,4),(120,'2025-10-14 16:00:00','pendiente',NULL,NULL,5250,30,4),(121,'2025-07-15 10:00:00','completado',5,'Excelente pintura interior',20000,37,5),(122,'2025-07-18 15:00:00','completado',NULL,NULL,12600,38,5),(123,'2025-07-20 11:30:00','cancelado',NULL,NULL,8400,39,5),(124,'2025-07-22 09:00:00','completado',4,'Buen trabajo decorativo',15000,40,5),(125,'2025-07-25 14:00:00','completado',NULL,NULL,8400,41,5),(126,'2025-07-27 16:30:00','completado',5,'Muy profesional',8000,42,5),(127,'2025-07-30 10:00:00','cancelado',NULL,NULL,47250,43,5),(128,'2025-08-02 13:00:00','completado',NULL,NULL,8400,44,5),(129,'2025-08-05 09:30:00','completado',4,'Satisfactorio',6000,45,5),(130,'2025-08-08 15:00:00','cancelado',NULL,NULL,15750,37,5),(131,'2025-08-11 11:00:00','completado',NULL,NULL,12600,38,5),(132,'2025-08-14 16:00:00','completado',5,'Perfecto',12000,40,5),(133,'2025-08-17 09:00:00','confirmado',NULL,NULL,8400,39,5),(134,'2025-08-20 14:30:00','pendiente',NULL,NULL,8400,41,5),(135,'2025-08-24 10:00:00','cancelado',NULL,NULL,6300,42,5),(136,'2025-08-27 16:00:00','confirmado',NULL,NULL,47250,43,5),(137,'2025-08-31 11:30:00','pendiente',NULL,NULL,8400,44,5),(138,'2025-09-04 09:00:00','confirmado',NULL,NULL,5250,45,5),(139,'2025-09-07 15:00:00','cancelado',NULL,NULL,15750,37,5),(140,'2025-09-10 10:30:00','pendiente',NULL,NULL,12600,38,5),(141,'2025-09-14 14:00:00','confirmado',NULL,NULL,8400,39,5),(142,'2025-09-17 09:30:00','pendiente',NULL,NULL,5250,40,5),(143,'2025-09-21 16:00:00','cancelado',NULL,NULL,8400,41,5),(144,'2025-09-24 11:00:00','confirmado',NULL,NULL,6300,42,5),(145,'2025-09-28 10:00:00','pendiente',NULL,NULL,47250,43,5),(146,'2025-10-01 15:30:00','confirmado',NULL,NULL,8400,44,5),(147,'2025-10-05 09:00:00','cancelado',NULL,NULL,5250,45,5),(148,'2025-10-08 14:00:00','pendiente',NULL,NULL,15750,37,5),(149,'2025-10-12 10:30:00','confirmado',NULL,NULL,12600,38,5),(150,'2025-10-15 16:00:00','pendiente',NULL,NULL,8400,39,5),(151,'2025-07-16 08:30:00','completado',5,'Excelente carpintería',45000,46,6),(152,'2025-07-19 14:00:00','completado',NULL,NULL,26250,47,6),(153,'2025-07-21 10:30:00','cancelado',NULL,NULL,21000,48,6),(154,'2025-07-23 16:00:00','completado',4,'Buen trabajo',30000,49,6),(155,'2025-07-26 11:00:00','completado',NULL,NULL,6300,50,6),(156,'2025-07-28 15:30:00','completado',5,'Muy profesional',25000,51,6),(157,'2025-07-31 09:00:00','cancelado',NULL,NULL,52500,52,6),(158,'2025-08-03 13:00:00','completado',NULL,NULL,8400,53,6),(159,'2025-08-06 10:30:00','completado',4,'Satisfactorio',6000,54,6),(160,'2025-08-09 16:00:00','cancelado',NULL,NULL,15750,55,6),(161,'2025-08-12 12:00:00','completado',NULL,NULL,31500,46,6),(162,'2025-08-15 17:00:00','completado',5,'Perfecto',25000,49,6),(163,'2025-08-18 09:30:00','confirmado',NULL,NULL,26250,47,6),(164,'2025-08-21 14:00:00','pendiente',NULL,NULL,21000,48,6),(165,'2025-08-25 10:30:00','cancelado',NULL,NULL,6300,50,6),(166,'2025-08-28 16:00:00','confirmado',NULL,NULL,31500,51,6),(167,'2025-09-01 11:00:00','pendiente',NULL,NULL,52500,52,6),(168,'2025-09-04 15:30:00','confirmado',NULL,NULL,8400,53,6),(169,'2025-09-07 09:00:00','cancelado',NULL,NULL,42000,54,6),(170,'2025-09-10 13:30:00','pendiente',NULL,NULL,15750,55,6),(171,'2025-09-14 10:00:00','confirmado',NULL,NULL,31500,46,6),(172,'2025-09-17 16:00:00','pendiente',NULL,NULL,26250,47,6),(173,'2025-09-21 11:30:00','cancelado',NULL,NULL,21000,48,6),(174,'2025-09-24 14:00:00','confirmado',NULL,NULL,26250,49,6),(175,'2025-09-28 09:30:00','pendiente',NULL,NULL,6300,50,6),(176,'2025-10-01 15:00:00','confirmado',NULL,NULL,31500,51,6),(177,'2025-10-05 10:30:00','cancelado',NULL,NULL,52500,52,6),(178,'2025-10-08 16:00:00','pendiente',NULL,NULL,8400,53,6),(179,'2025-10-12 12:00:00','confirmado',NULL,NULL,42000,54,6),(180,'2025-10-15 17:30:00','pendiente',NULL,NULL,15750,55,6),(181,'2025-07-17 09:00:00','completado',4,'Buen servicio de construcción',50000,56,7),(182,'2025-07-20 14:30:00','completado',NULL,NULL,21000,57,7),(183,'2025-07-22 11:00:00','cancelado',NULL,NULL,4200,58,7),(184,'2025-07-24 16:30:00','completado',5,'Excelente',15000,59,7),(185,'2025-07-27 10:00:00','completado',NULL,NULL,15750,60,7),(186,'2025-07-30 15:00:00','completado',4,'Muy bueno',60000,61,7),(187,'2025-08-02 09:30:00','cancelado',NULL,NULL,8400,62,7),(188,'2025-08-05 13:30:00','completado',NULL,NULL,5250,63,7),(189,'2025-08-08 11:00:00','completado',5,'Perfecto',18000,64,7),(190,'2025-08-11 16:00:00','cancelado',NULL,NULL,10500,56,7),(191,'2025-08-14 12:30:00','completado',NULL,NULL,21000,57,7),(192,'2025-08-17 17:00:00','completado',4,'Satisfactorio',20000,59,7),(193,'2025-08-20 10:00:00','confirmado',NULL,NULL,4200,58,7),(194,'2025-08-23 14:30:00','pendiente',NULL,NULL,15750,60,7),(195,'2025-08-27 11:00:00','cancelado',NULL,NULL,12600,61,7),(196,'2025-08-30 16:30:00','confirmado',NULL,NULL,8400,62,7),(197,'2025-09-03 10:00:00','pendiente',NULL,NULL,5250,63,7),(198,'2025-09-06 15:00:00','confirmado',NULL,NULL,6300,64,7),(199,'2025-09-09 09:30:00','cancelado',NULL,NULL,10500,56,7),(200,'2025-09-12 13:30:00','pendiente',NULL,NULL,21000,57,7),(201,'2025-09-16 10:30:00','confirmado',NULL,NULL,4200,58,7),(202,'2025-09-19 16:00:00','pendiente',NULL,NULL,3150,59,7),(203,'2025-09-23 12:00:00','cancelado',NULL,NULL,15750,60,7),(204,'2025-09-26 14:30:00','confirmado',NULL,NULL,12600,61,7),(205,'2025-09-30 09:00:00','pendiente',NULL,NULL,8400,62,7),(206,'2025-10-03 15:30:00','confirmado',NULL,NULL,5250,63,7),(207,'2025-10-07 10:30:00','cancelado',NULL,NULL,6300,64,7),(208,'2025-10-10 16:00:00','pendiente',NULL,NULL,10500,56,7),(209,'2025-10-14 12:30:00','confirmado',NULL,NULL,21000,57,7),(210,'2025-10-17 17:30:00','pendiente',NULL,NULL,4200,58,7),(211,'2025-07-18 08:00:00','completado',5,'Excelente cerrajería',4000,65,8),(212,'2025-07-21 13:00:00','completado',NULL,NULL,6300,66,8),(213,'2025-07-23 10:30:00','cancelado',NULL,NULL,18900,67,8),(214,'2025-07-25 15:00:00','completado',4,'Buen trabajo',12000,68,8),(215,'2025-07-28 11:00:00','completado',NULL,NULL,36750,69,8),(216,'2025-07-31 16:30:00','completado',5,'Muy profesional',5000,70,8),(217,'2025-08-03 09:00:00','cancelado',NULL,NULL,42000,71,8),(218,'2025-08-06 14:00:00','completado',NULL,NULL,8400,72,8),(219,'2025-08-09 10:30:00','completado',4,'Satisfactorio',6000,73,8),(220,'2025-08-12 16:00:00','cancelado',NULL,NULL,5250,65,8),(221,'2025-08-15 12:00:00','completado',NULL,NULL,6300,66,8),(222,'2025-08-18 17:00:00','completado',5,'Perfecto',8000,68,8),(223,'2025-08-21 09:30:00','confirmado',NULL,NULL,18900,67,8),(224,'2025-08-24 14:30:00','pendiente',NULL,NULL,36750,69,8),(225,'2025-08-28 10:00:00','cancelado',NULL,NULL,12600,70,8),(226,'2025-08-31 16:00:00','confirmado',NULL,NULL,42000,71,8),(227,'2025-09-04 11:30:00','pendiente',NULL,NULL,8400,72,8),(228,'2025-09-07 15:30:00','confirmado',NULL,NULL,12600,73,8),(229,'2025-09-10 09:00:00','cancelado',NULL,NULL,5250,65,8),(230,'2025-09-13 13:30:00','pendiente',NULL,NULL,6300,66,8),(231,'2025-09-17 10:30:00','confirmado',NULL,NULL,18900,67,8),(232,'2025-09-20 16:00:00','pendiente',NULL,NULL,4200,68,8),(233,'2025-09-24 12:00:00','cancelado',NULL,NULL,36750,69,8),(234,'2025-09-27 14:30:00','confirmado',NULL,NULL,12600,70,8),(235,'2025-10-01 09:30:00','pendiente',NULL,NULL,42000,71,8),(236,'2025-10-04 15:30:00','confirmado',NULL,NULL,8400,72,8),(237,'2025-10-08 10:00:00','cancelado',NULL,NULL,12600,73,8),(238,'2025-10-11 16:00:00','pendiente',NULL,NULL,5250,65,8),(239,'2025-10-15 12:00:00','confirmado',NULL,NULL,6300,66,8),(240,'2025-10-18 17:30:00','pendiente',NULL,NULL,18900,67,8),(241,'2025-07-19 10:00:00','completado',4,'Buen servicio de climatización',18000,74,9),(242,'2025-07-22 15:00:00','completado',NULL,NULL,8400,75,9),(243,'2025-07-24 11:30:00','cancelado',NULL,NULL,8400,76,9),(244,'2025-07-26 09:00:00','completado',5,'Excelente',12000,77,9),(245,'2025-07-29 14:00:00','completado',NULL,NULL,8400,78,9),(246,'2025-08-01 16:30:00','completado',4,'Muy bueno',8000,79,9),(247,'2025-08-04 10:00:00','cancelado',NULL,NULL,12600,80,9),(248,'2025-08-07 13:00:00','completado',NULL,NULL,26250,74,9),(249,'2025-08-10 09:30:00','completado',5,'Perfecto',40000,75,9),(250,'2025-08-13 15:00:00','cancelado',NULL,NULL,8400,76,9),(251,'2025-08-16 11:00:00','completado',NULL,NULL,5250,77,9),(252,'2025-08-19 16:00:00','completado',4,'Satisfactorio',25000,78,9),(253,'2025-08-22 10:00:00','confirmado',NULL,NULL,8400,79,9),(254,'2025-08-25 14:30:00','pendiente',NULL,NULL,12600,80,9),(255,'2025-08-29 11:00:00','cancelado',NULL,NULL,26250,74,9),(256,'2025-09-01 16:00:00','confirmado',NULL,NULL,8400,75,9),(257,'2025-09-05 10:30:00','pendiente',NULL,NULL,8400,76,9),(258,'2025-09-08 15:30:00','confirmado',NULL,NULL,5250,77,9),(259,'2025-09-11 09:00:00','cancelado',NULL,NULL,8400,78,9),(260,'2025-09-14 13:30:00','pendiente',NULL,NULL,8400,79,9),(261,'2025-09-18 10:30:00','confirmado',NULL,NULL,12600,80,9),(262,'2025-09-21 16:00:00','pendiente',NULL,NULL,26250,74,9),(263,'2025-09-25 12:00:00','cancelado',NULL,NULL,8400,75,9),(264,'2025-09-28 14:30:00','confirmado',NULL,NULL,8400,76,9),(265,'2025-10-02 09:30:00','pendiente',NULL,NULL,5250,77,9),(266,'2025-10-05 15:30:00','confirmado',NULL,NULL,8400,78,9),(267,'2025-10-09 10:00:00','cancelado',NULL,NULL,8400,79,9),(268,'2025-10-12 16:00:00','pendiente',NULL,NULL,12600,80,9),(269,'2025-10-16 12:00:00','confirmado',NULL,NULL,26250,74,9),(270,'2025-10-19 17:30:00','pendiente',NULL,NULL,8400,75,9),(271,'2025-07-20 08:30:00','completado',5,'Excelente reparación',8000,81,10),(272,'2025-07-23 13:30:00','completado',NULL,NULL,15750,82,10),(273,'2025-07-25 10:00:00','cancelado',NULL,NULL,12600,83,10),(274,'2025-07-27 15:30:00','completado',4,'Buen trabajo técnico',8000,84,10),(275,'2025-07-30 11:00:00','completado',NULL,NULL,6300,85,10),(276,'2025-08-02 16:00:00','completado',5,'Muy profesional',12000,86,10),(277,'2025-08-05 09:30:00','cancelado',NULL,NULL,10500,81,10),(278,'2025-08-08 14:00:00','completado',NULL,NULL,15750,82,10),(279,'2025-08-11 10:30:00','completado',4,'Satisfactorio',10000,84,10),(280,'2025-08-14 16:00:00','cancelado',NULL,NULL,6300,85,10),(281,'2025-08-17 12:00:00','completado',NULL,NULL,4200,86,10),(282,'2025-08-20 17:00:00','completado',5,'Perfecto',18000,83,10),(283,'2025-08-23 09:30:00','confirmado',NULL,NULL,10500,81,10),(284,'2025-08-26 14:30:00','pendiente',NULL,NULL,15750,82,10),(285,'2025-08-30 10:00:00','cancelado',NULL,NULL,12600,83,10),(286,'2025-09-02 16:00:00','confirmado',NULL,NULL,8400,84,10),(287,'2025-09-06 11:30:00','pendiente',NULL,NULL,6300,85,10),(288,'2025-09-09 15:30:00','confirmado',NULL,NULL,4200,86,10),(289,'2025-09-12 09:00:00','cancelado',NULL,NULL,10500,81,10),(290,'2025-09-15 13:30:00','pendiente',NULL,NULL,15750,82,10),(291,'2025-09-19 10:30:00','confirmado',NULL,NULL,12600,83,10),(292,'2025-09-22 16:00:00','pendiente',NULL,NULL,8400,84,10),(293,'2025-09-26 12:00:00','cancelado',NULL,NULL,6300,85,10),(294,'2025-09-29 14:30:00','confirmado',NULL,NULL,4200,86,10),(295,'2025-10-03 09:30:00','pendiente',NULL,NULL,10500,81,10),(296,'2025-10-06 15:30:00','confirmado',NULL,NULL,15750,82,10),(297,'2025-10-10 10:00:00','cancelado',NULL,NULL,12600,83,10),(298,'2025-10-13 16:00:00','pendiente',NULL,NULL,8400,84,10),(299,'2025-10-17 12:00:00','confirmado',NULL,NULL,6300,85,10),(300,'2025-10-20 17:30:00','pendiente',NULL,NULL,4200,86,10),(301,'2025-07-21 09:00:00','completado',4,'Buen servicio integral',8000,87,11),(302,'2025-07-24 14:00:00','completado',NULL,NULL,21000,88,11),(303,'2025-07-26 11:30:00','cancelado',NULL,NULL,26250,89,11),(304,'2025-07-28 16:00:00','completado',5,'Excelente',20000,90,11),(305,'2025-07-31 10:00:00','completado',NULL,NULL,12600,91,11),(306,'2025-08-03 15:00:00','completado',4,'Muy bueno',10000,92,11),(307,'2025-08-06 09:30:00','cancelado',NULL,NULL,5250,87,11),(308,'2025-08-09 13:30:00','completado',NULL,NULL,21000,88,11),(309,'2025-08-12 10:30:00','completado',5,'Perfecto',15000,90,11),(310,'2025-08-15 16:00:00','cancelado',NULL,NULL,12600,91,11),(311,'2025-08-18 12:00:00','completado',NULL,NULL,10500,92,11),(312,'2025-08-21 17:00:00','completado',4,'Satisfactorio',6000,89,11),(313,'2025-08-24 09:30:00','confirmado',NULL,NULL,5250,87,11),(314,'2025-08-27 14:30:00','pendiente',NULL,NULL,21000,88,11),(315,'2025-08-31 10:00:00','cancelado',NULL,NULL,26250,89,11),(316,'2025-09-03 16:00:00','confirmado',NULL,NULL,12600,90,11),(317,'2025-09-07 11:30:00','pendiente',NULL,NULL,12600,91,11),(318,'2025-09-10 15:30:00','confirmado',NULL,NULL,10500,92,11),(319,'2025-09-13 09:00:00','cancelado',NULL,NULL,5250,87,11),(320,'2025-09-16 13:30:00','pendiente',NULL,NULL,21000,88,11),(321,'2025-09-20 10:30:00','confirmado',NULL,NULL,26250,89,11),(322,'2025-09-23 16:00:00','pendiente',NULL,NULL,12600,90,11),(323,'2025-09-27 12:00:00','cancelado',NULL,NULL,12600,91,11),(324,'2025-09-30 14:30:00','confirmado',NULL,NULL,10500,92,11),(325,'2025-10-04 09:30:00','pendiente',NULL,NULL,5250,87,11),(326,'2025-10-07 15:30:00','confirmado',NULL,NULL,21000,88,11),(327,'2025-10-11 10:00:00','cancelado',NULL,NULL,26250,89,11),(328,'2025-10-14 16:00:00','pendiente',NULL,NULL,12600,90,11),(329,'2025-10-18 12:00:00','confirmado',NULL,NULL,12600,91,11),(330,'2025-10-21 17:30:00','pendiente',NULL,NULL,10500,92,11),(331,'2025-07-22 08:00:00','completado',5,'Excelente servicio del hogar',15000,93,12),(332,'2025-07-25 13:00:00','completado',NULL,NULL,26250,94,12),(333,'2025-07-27 10:30:00','cancelado',NULL,NULL,21000,95,12),(334,'2025-07-29 15:00:00','completado',4,'Buen trabajo',5000,96,12),(335,'2025-08-01 11:00:00','completado',NULL,NULL,8400,97,12),(336,'2025-08-04 16:30:00','completado',5,'Muy profesional',12000,98,12),(337,'2025-08-07 09:00:00','cancelado',NULL,NULL,8400,93,12),(338,'2025-08-10 14:00:00','completado',NULL,NULL,26250,94,12),(339,'2025-08-13 10:30:00','completado',4,'Satisfactorio',8000,96,12),(340,'2025-08-16 16:00:00','cancelado',NULL,NULL,8400,97,12),(341,'2025-08-19 12:00:00','completado',NULL,NULL,15750,98,12),(342,'2025-08-22 17:00:00','completado',5,'Perfecto',6000,95,12),(343,'2025-08-25 09:30:00','confirmado',NULL,NULL,8400,93,12),(344,'2025-08-28 14:30:00','pendiente',NULL,NULL,26250,94,12),(345,'2025-09-01 10:00:00','cancelado',NULL,NULL,21000,95,12),(346,'2025-09-04 16:00:00','confirmado',NULL,NULL,31500,96,12),(347,'2025-09-08 11:30:00','pendiente',NULL,NULL,8400,97,12),(348,'2025-09-11 15:30:00','confirmado',NULL,NULL,15750,98,12),(349,'2025-09-14 09:00:00','cancelado',NULL,NULL,8400,93,12),(350,'2025-09-17 13:30:00','pendiente',NULL,NULL,26250,94,12),(351,'2025-09-21 10:30:00','confirmado',NULL,NULL,21000,95,12),(352,'2025-09-24 16:00:00','pendiente',NULL,NULL,31500,96,12),(353,'2025-09-28 12:00:00','cancelado',NULL,NULL,8400,97,12),(354,'2025-10-01 14:30:00','confirmado',NULL,NULL,15750,98,12),(355,'2025-10-05 09:30:00','pendiente',NULL,NULL,8400,93,12),(356,'2025-10-08 15:30:00','confirmado',NULL,NULL,26250,94,12),(357,'2025-10-12 10:00:00','cancelado',NULL,NULL,21000,95,12),(358,'2025-10-15 16:00:00','pendiente',NULL,NULL,31500,96,12),(359,'2025-10-19 12:00:00','confirmado',NULL,NULL,8400,97,12),(360,'2025-10-22 17:30:00','pendiente',NULL,NULL,15750,98,12),(361,'2025-07-23 10:00:00','completado',4,'Buen servicio integral',25000,99,13),(362,'2025-07-26 15:00:00','completado',NULL,NULL,15750,100,13),(363,'2025-07-28 11:30:00','cancelado',NULL,NULL,5250,101,13),(364,'2025-07-30 09:00:00','completado',5,'Excelente trabajo',20000,102,13),(365,'2025-08-02 14:00:00','completado',NULL,NULL,5250,103,13),(366,'2025-08-05 16:30:00','completado',4,'Muy bueno',15000,104,13),(367,'2025-08-08 10:00:00','cancelado',NULL,NULL,6300,99,13),(368,'2025-08-11 13:00:00','completado',NULL,NULL,15750,100,13),(369,'2025-08-14 09:30:00','completado',5,'Perfecto',10000,102,13),(370,'2025-08-17 15:00:00','cancelado',NULL,NULL,5250,103,13),(371,'2025-08-20 11:00:00','completado',NULL,NULL,4200,104,13),(372,'2025-08-23 16:00:00','completado',4,'Satisfactorio',12000,101,13),(373,'2025-08-26 09:30:00','confirmado',NULL,NULL,6300,99,13),(374,'2025-08-29 14:30:00','pendiente',NULL,NULL,15750,100,13),(375,'2025-09-02 10:00:00','cancelado',NULL,NULL,5250,101,13),(376,'2025-09-05 16:00:00','confirmado',NULL,NULL,6300,102,13),(377,'2025-09-09 11:30:00','pendiente',NULL,NULL,5250,103,13),(378,'2025-09-12 15:30:00','confirmado',NULL,NULL,4200,104,13),(379,'2025-09-15 09:00:00','cancelado',NULL,NULL,6300,99,13),(380,'2025-09-18 13:30:00','pendiente',NULL,NULL,15750,100,13),(381,'2025-09-22 10:30:00','confirmado',NULL,NULL,5250,101,13),(382,'2025-09-25 16:00:00','pendiente',NULL,NULL,6300,102,13),(383,'2025-09-29 12:00:00','cancelado',NULL,NULL,5250,103,13),(384,'2025-10-02 14:30:00','confirmado',NULL,NULL,4200,104,13),(385,'2025-10-06 09:30:00','pendiente',NULL,NULL,6300,99,13),(386,'2025-10-09 15:30:00','confirmado',NULL,NULL,15750,100,13),(387,'2025-10-13 10:00:00','cancelado',NULL,NULL,5250,101,13),(388,'2025-10-16 16:00:00','pendiente',NULL,NULL,6300,102,13),(389,'2025-10-20 12:00:00','confirmado',NULL,NULL,5250,103,13),(390,'2025-10-23 17:30:00','pendiente',NULL,NULL,4200,104,13),(391,'2025-07-24 08:30:00','completado',5,'Excelente hogar y jardín',6000,105,14),(392,'2025-07-27 13:30:00','completado',NULL,NULL,10500,106,14),(393,'2025-07-29 10:00:00','cancelado',NULL,NULL,12600,107,14),(394,'2025-07-31 15:30:00','completado',4,'Buen trabajo',4000,108,14),(395,'2025-08-03 11:00:00','completado',NULL,NULL,12600,109,14),(396,'2025-08-06 16:00:00','completado',5,'Muy profesional',12000,110,14),(397,'2025-08-09 09:30:00','cancelado',NULL,NULL,12600,105,14),(398,'2025-08-12 14:00:00','completado',NULL,NULL,10500,106,14),(399,'2025-08-15 10:30:00','completado',4,'Satisfactorio',6000,108,14),(400,'2025-08-18 16:00:00','cancelado',NULL,NULL,12600,109,14),(401,'2025-08-21 12:00:00','completado',NULL,NULL,21000,110,14),(402,'2025-08-24 17:00:00','completado',5,'Perfecto',8000,107,14),(403,'2025-08-27 09:30:00','confirmado',NULL,NULL,12600,105,14),(404,'2025-08-30 14:30:00','pendiente',NULL,NULL,10500,106,14),(405,'2025-09-03 10:00:00','cancelado',NULL,NULL,12600,107,14),(406,'2025-09-06 16:00:00','confirmado',NULL,NULL,8400,108,14),(407,'2025-09-10 11:30:00','pendiente',NULL,NULL,12600,109,14),(408,'2025-09-13 15:30:00','confirmado',NULL,NULL,21000,110,14),(409,'2025-09-16 09:00:00','cancelado',NULL,NULL,12600,105,14),(410,'2025-09-19 13:30:00','pendiente',NULL,NULL,10500,106,14),(411,'2025-09-23 10:30:00','confirmado',NULL,NULL,12600,107,14),(412,'2025-09-26 16:00:00','pendiente',NULL,NULL,8400,108,14),(413,'2025-09-30 12:00:00','cancelado',NULL,NULL,12600,109,14),(414,'2025-10-03 14:30:00','confirmado',NULL,NULL,21000,110,14),(415,'2025-10-07 09:30:00','pendiente',NULL,NULL,12600,105,14),(416,'2025-10-10 15:30:00','confirmado',NULL,NULL,10500,106,14),(417,'2025-10-14 10:00:00','cancelado',NULL,NULL,12600,107,14),(418,'2025-10-17 16:00:00','pendiente',NULL,NULL,8400,108,14),(419,'2025-10-21 12:00:00','confirmado',NULL,NULL,12600,109,14),(420,'2025-10-24 17:30:00','pendiente',NULL,NULL,21000,110,14),(421,'2025-07-25 09:00:00','completado',4,'Buen servicio inmobiliario',8000,111,15),(422,'2025-07-28 14:00:00','completado',NULL,NULL,10500,112,15),(423,'2025-07-30 11:30:00','cancelado',NULL,NULL,15750,113,15),(424,'2025-08-01 16:00:00','completado',5,'Excelente',12000,114,15),(425,'2025-08-04 10:00:00','completado',NULL,NULL,21000,115,15),(426,'2025-08-07 15:00:00','completado',4,'Muy bueno',15000,116,15),(427,'2025-08-10 09:30:00','cancelado',NULL,NULL,31500,111,15),(428,'2025-08-13 13:30:00','completado',NULL,NULL,10500,112,15),(429,'2025-08-16 10:30:00','completado',5,'Perfecto',8000,114,15),(430,'2025-08-19 16:00:00','cancelado',NULL,NULL,21000,115,15),(431,'2025-08-22 12:00:00','completado',NULL,NULL,10500,116,15),(432,'2025-08-25 17:00:00','completado',4,'Satisfactorio',12000,113,15),(433,'2025-08-28 09:30:00','confirmado',NULL,NULL,31500,111,15),(434,'2025-08-31 14:30:00','pendiente',NULL,NULL,10500,112,15),(435,'2025-09-04 10:00:00','cancelado',NULL,NULL,15750,113,15),(436,'2025-09-07 16:00:00','confirmado',NULL,NULL,10500,114,15),(437,'2025-09-11 11:30:00','pendiente',NULL,NULL,21000,115,15),(438,'2025-09-14 15:30:00','confirmado',NULL,NULL,10500,116,15),(439,'2025-09-17 09:00:00','cancelado',NULL,NULL,31500,111,15),(440,'2025-09-20 13:30:00','pendiente',NULL,NULL,10500,112,15),(441,'2025-09-24 10:30:00','confirmado',NULL,NULL,15750,113,15),(442,'2025-09-27 16:00:00','pendiente',NULL,NULL,10500,114,15),(443,'2025-10-01 12:00:00','cancelado',NULL,NULL,21000,115,15),(444,'2025-10-04 14:30:00','confirmado',NULL,NULL,10500,116,15),(445,'2025-10-08 09:30:00','pendiente',NULL,NULL,31500,111,15),(446,'2025-10-11 15:30:00','confirmado',NULL,NULL,10500,112,15),(447,'2025-10-15 10:00:00','cancelado',NULL,NULL,15750,113,15),(448,'2025-10-18 16:00:00','pendiente',NULL,NULL,10500,114,15),(449,'2025-10-22 12:00:00','confirmado',NULL,NULL,21000,115,15),(450,'2025-10-25 17:30:00','pendiente',NULL,NULL,10500,116,15),(451,'2025-07-26 08:00:00','completado',5,'Excelente limpieza industrial',12000,117,16),(452,'2025-07-29 13:00:00','completado',NULL,NULL,6300,118,16),(453,'2025-07-31 10:30:00','cancelado',NULL,NULL,8400,119,16),(454,'2025-08-02 15:00:00','completado',4,'Buen trabajo',8000,120,16),(455,'2025-08-05 11:00:00','completado',NULL,NULL,12600,121,16),(456,'2025-08-08 16:30:00','completado',5,'Muy profesional',15000,122,16),(457,'2025-08-11 09:00:00','cancelado',NULL,NULL,15750,117,16),(458,'2025-08-14 14:00:00','completado',NULL,NULL,6300,118,16),(459,'2025-08-17 10:30:00','completado',4,'Satisfactorio',10000,120,16),(460,'2025-08-20 16:00:00','cancelado',NULL,NULL,12600,121,16),(461,'2025-08-23 12:00:00','completado',NULL,NULL,15750,122,16),(462,'2025-08-26 17:00:00','completado',5,'Perfecto',20000,119,16),(463,'2025-08-29 09:30:00','confirmado',NULL,NULL,15750,117,16),(464,'2025-09-01 14:30:00','pendiente',NULL,NULL,6300,118,16),(465,'2025-09-05 10:00:00','cancelado',NULL,NULL,8400,119,16),(466,'2025-09-08 16:00:00','confirmado',NULL,NULL,21000,120,16),(467,'2025-09-12 11:30:00','pendiente',NULL,NULL,12600,121,16),(468,'2025-09-15 15:30:00','confirmado',NULL,NULL,15750,122,16),(469,'2025-09-18 09:00:00','cancelado',NULL,NULL,15750,117,16),(470,'2025-09-21 13:30:00','pendiente',NULL,NULL,6300,118,16),(471,'2025-09-25 10:30:00','confirmado',NULL,NULL,8400,119,16),(472,'2025-09-28 16:00:00','pendiente',NULL,NULL,21000,120,16),(473,'2025-10-02 12:00:00','cancelado',NULL,NULL,12600,121,16),(474,'2025-10-05 14:30:00','confirmado',NULL,NULL,15750,122,16),(475,'2025-10-09 09:30:00','pendiente',NULL,NULL,15750,117,16),(476,'2025-10-12 15:30:00','confirmado',NULL,NULL,6300,118,16),(477,'2025-10-16 10:00:00','cancelado',NULL,NULL,8400,119,16),(478,'2025-10-19 16:00:00','pendiente',NULL,NULL,21000,120,16),(479,'2025-10-23 12:00:00','confirmado',NULL,NULL,12600,121,16),(480,'2025-10-26 17:30:00','pendiente',NULL,NULL,15750,122,16),(481,'2025-07-27 10:00:00','completado',4,'Buen control de plagas',8000,123,17),(482,'2025-07-30 15:00:00','completado',NULL,NULL,6300,124,17),(483,'2025-08-01 11:30:00','cancelado',NULL,NULL,4200,125,17),(484,'2025-08-03 09:00:00','completado',5,'Excelente trabajo',15000,126,17),(485,'2025-08-06 14:00:00','completado',NULL,NULL,8400,127,17),(486,'2025-08-09 16:30:00','completado',4,'Muy bueno',10000,128,17),(487,'2025-08-12 10:00:00','cancelado',NULL,NULL,6300,123,17),(488,'2025-08-15 13:00:00','completado',NULL,NULL,6300,124,17),(489,'2025-08-18 09:30:00','completado',5,'Perfecto',25000,126,17),(490,'2025-08-21 15:00:00','cancelado',NULL,NULL,8400,127,17),(491,'2025-08-24 11:00:00','completado',NULL,NULL,5250,128,17),(492,'2025-08-27 16:00:00','completado',4,'Satisfactorio',15000,125,17),(493,'2025-08-30 09:30:00','confirmado',NULL,NULL,6300,123,17),(494,'2025-09-02 14:30:00','pendiente',NULL,NULL,6300,124,17),(495,'2025-09-06 10:00:00','cancelado',NULL,NULL,4200,125,17),(496,'2025-09-09 16:00:00','confirmado',NULL,NULL,12600,126,17),(497,'2025-09-13 11:30:00','pendiente',NULL,NULL,8400,127,17),(498,'2025-09-16 15:30:00','confirmado',NULL,NULL,5250,128,17),(499,'2025-09-19 09:00:00','cancelado',NULL,NULL,6300,123,17),(500,'2025-09-22 13:30:00','pendiente',NULL,NULL,6300,124,17),(501,'2025-09-26 10:30:00','confirmado',NULL,NULL,4200,125,17),(502,'2025-09-29 16:00:00','pendiente',NULL,NULL,12600,126,17),(503,'2025-10-03 12:00:00','cancelado',NULL,NULL,8400,127,17),(504,'2025-10-06 14:30:00','confirmado',NULL,NULL,5250,128,17),(505,'2025-10-10 09:30:00','pendiente',NULL,NULL,6300,123,17),(506,'2025-10-13 15:30:00','confirmado',NULL,NULL,6300,124,17),(507,'2025-10-17 10:00:00','cancelado',NULL,NULL,4200,125,17),(508,'2025-10-20 16:00:00','pendiente',NULL,NULL,12600,126,17),(509,'2025-10-24 12:00:00','confirmado',NULL,NULL,8400,127,17),(510,'2025-10-27 17:30:00','pendiente',NULL,NULL,5250,128,17),(511,'2025-07-28 08:30:00','completado',5,'Excelente mantenimiento',15000,129,18),(512,'2025-07-31 13:30:00','completado',NULL,NULL,8400,130,18),(513,'2025-08-02 10:00:00','cancelado',NULL,NULL,12600,131,18),(514,'2025-08-04 15:30:00','completado',4,'Buen trabajo',20000,132,18),(515,'2025-08-07 11:00:00','completado',NULL,NULL,21000,133,18),(516,'2025-08-10 16:00:00','completado',5,'Muy profesional',8000,134,18),(517,'2025-08-13 09:30:00','cancelado',NULL,NULL,12600,129,18),(518,'2025-08-16 14:00:00','completado',NULL,NULL,8400,130,18),(519,'2025-08-19 10:30:00','completado',4,'Satisfactorio',12000,132,18),(520,'2025-08-22 16:00:00','cancelado',NULL,NULL,21000,133,18),(521,'2025-08-25 12:00:00','completado',NULL,NULL,12600,134,18),(522,'2025-08-28 17:00:00','completado',5,'Perfecto',10000,131,18),(523,'2025-08-31 09:30:00','confirmado',NULL,NULL,12600,129,18),(524,'2025-09-03 14:30:00','pendiente',NULL,NULL,8400,130,18),(525,'2025-09-07 10:00:00','cancelado',NULL,NULL,12600,131,18),(526,'2025-09-10 16:00:00','confirmado',NULL,NULL,15750,132,18),(527,'2025-09-14 11:30:00','pendiente',NULL,NULL,21000,133,18),(528,'2025-09-17 15:30:00','confirmado',NULL,NULL,12600,134,18),(529,'2025-09-20 09:00:00','cancelado',NULL,NULL,12600,129,18),(530,'2025-09-23 13:30:00','pendiente',NULL,NULL,8400,130,18),(531,'2025-09-27 10:30:00','confirmado',NULL,NULL,12600,131,18),(532,'2025-09-30 16:00:00','pendiente',NULL,NULL,15750,132,18),(533,'2025-10-04 12:00:00','cancelado',NULL,NULL,21000,133,18),(534,'2025-10-07 14:30:00','confirmado',NULL,NULL,12600,134,18),(535,'2025-10-11 09:30:00','pendiente',NULL,NULL,12600,129,18),(536,'2025-10-14 15:30:00','confirmado',NULL,NULL,8400,130,18),(537,'2025-10-18 10:00:00','cancelado',NULL,NULL,12600,131,18),(538,'2025-10-21 16:00:00','pendiente',NULL,NULL,15750,132,18),(539,'2025-10-25 12:00:00','confirmado',NULL,NULL,21000,133,18),(540,'2025-10-28 17:30:00','pendiente',NULL,NULL,12600,134,18),(541,'2025-07-29 09:00:00','completado',4,'Buen servicio de piscinas',6000,135,19),(542,'2025-08-01 14:00:00','completado',NULL,NULL,15750,136,19),(543,'2025-08-03 11:30:00','cancelado',NULL,NULL,21000,137,19),(544,'2025-08-05 16:00:00','completado',5,'Excelente',4000,138,19),(545,'2025-08-08 10:00:00','completado',NULL,NULL,8400,139,19),(546,'2025-08-11 15:00:00','completado',4,'Muy bueno',12000,140,19),(547,'2025-08-14 09:30:00','cancelado',NULL,NULL,8400,135,19),(548,'2025-08-17 13:30:00','completado',NULL,NULL,15750,136,19),(549,'2025-08-20 10:30:00','completado',5,'Perfecto',240000,139,19),(550,'2025-08-23 16:00:00','cancelado',NULL,NULL,12600,140,19),(551,'2025-08-26 12:00:00','completado',NULL,NULL,21000,137,19),(552,'2025-08-29 17:00:00','completado',4,'Satisfactorio',18000,138,19),(553,'2025-09-01 09:30:00','confirmado',NULL,NULL,8400,135,19),(554,'2025-09-04 14:30:00','pendiente',NULL,NULL,15750,136,19),(555,'2025-09-08 10:00:00','cancelado',NULL,NULL,21000,137,19),(556,'2025-09-11 16:00:00','confirmado',NULL,NULL,15750,138,19),(557,'2025-09-15 11:30:00','pendiente',NULL,NULL,8400,139,19),(558,'2025-09-18 15:30:00','confirmado',NULL,NULL,12600,140,19),(559,'2025-09-21 09:00:00','cancelado',NULL,NULL,8400,135,19),(560,'2025-09-24 13:30:00','pendiente',NULL,NULL,15750,136,19),(561,'2025-09-28 10:30:00','confirmado',NULL,NULL,21000,137,19),(562,'2025-10-01 16:00:00','pendiente',NULL,NULL,15750,138,19),(563,'2025-10-05 12:00:00','cancelado',NULL,NULL,8400,139,19),(564,'2025-10-08 14:30:00','confirmado',NULL,NULL,12600,140,19),(565,'2025-10-12 09:30:00','pendiente',NULL,NULL,8400,135,19),(566,'2025-10-15 15:30:00','confirmado',NULL,NULL,15750,136,19),(567,'2025-10-19 10:00:00','cancelado',NULL,NULL,21000,137,19),(568,'2025-10-22 16:00:00','pendiente',NULL,NULL,15750,138,19),(569,'2025-10-26 12:00:00','confirmado',NULL,NULL,8400,139,19),(570,'2025-10-29 17:30:00','pendiente',NULL,NULL,12600,140,19),(571,'2025-07-30 08:00:00','completado',5,'Excelente decoración',15000,141,20),(572,'2025-08-02 13:00:00','completado',NULL,NULL,26250,142,20),(573,'2025-08-04 10:30:00','cancelado',NULL,NULL,15750,143,20),(574,'2025-08-06 15:00:00','completado',4,'Buen trabajo',12000,144,20),(575,'2025-08-09 11:00:00','completado',NULL,NULL,8400,145,20),(576,'2025-08-12 16:30:00','completado',5,'Muy profesional',30000,146,20),(577,'2025-08-15 09:00:00','cancelado',NULL,NULL,6300,141,20),(578,'2025-08-18 14:00:00','completado',NULL,NULL,26250,142,20),(579,'2025-08-21 10:30:00','completado',4,'Satisfactorio',12000,144,20),(580,'2025-08-24 16:00:00','cancelado',NULL,NULL,8400,145,20),(581,'2025-08-27 12:00:00','completado',NULL,NULL,4200,146,20),(582,'2025-08-30 17:00:00','completado',5,'Perfecto',20000,143,20),(583,'2025-09-02 09:30:00','confirmado',NULL,NULL,6300,141,20),(584,'2025-09-05 14:30:00','pendiente',NULL,NULL,26250,142,20),(585,'2025-09-09 10:00:00','cancelado',NULL,NULL,15750,143,20),(586,'2025-09-12 16:00:00','confirmado',NULL,NULL,10500,144,20),(587,'2025-09-16 11:30:00','pendiente',NULL,NULL,8400,145,20),(588,'2025-09-19 15:30:00','confirmado',NULL,NULL,4200,146,20),(589,'2025-09-22 09:00:00','cancelado',NULL,NULL,6300,141,20),(590,'2025-09-25 13:30:00','pendiente',NULL,NULL,26250,142,20),(591,'2025-09-29 10:30:00','confirmado',NULL,NULL,15750,143,20),(592,'2025-10-02 16:00:00','pendiente',NULL,NULL,10500,144,20),(593,'2025-10-06 12:00:00','cancelado',NULL,NULL,8400,145,20),(594,'2025-10-09 14:30:00','confirmado',NULL,NULL,4200,146,20),(595,'2025-10-13 09:30:00','pendiente',NULL,NULL,6300,141,20),(596,'2025-10-16 15:30:00','confirmado',NULL,NULL,26250,142,20),(597,'2025-10-20 10:00:00','cancelado',NULL,NULL,15750,143,20),(598,'2025-10-23 16:00:00','pendiente',NULL,NULL,10500,144,20),(599,'2025-10-27 12:00:00','confirmado',NULL,NULL,8400,145,20),(600,'2025-10-30 17:30:00','pendiente',NULL,NULL,4200,146,20),(601,'2025-07-13 09:00:00','completado',4,'Buen servicio de refrigeración',12000,147,21),(602,'2025-07-16 14:00:00','completado',NULL,NULL,12600,148,21),(603,'2025-07-18 11:30:00','cancelado',NULL,NULL,26250,149,21),(604,'2025-07-20 16:00:00','completado',5,'Excelente trabajo',40000,150,21),(605,'2025-07-23 10:00:00','completado',NULL,NULL,15750,151,21),(606,'2025-07-25 15:00:00','completado',4,'Muy bueno',8000,152,21),(607,'2025-07-28 09:30:00','cancelado',NULL,NULL,12600,147,21),(608,'2025-07-31 13:30:00','completado',NULL,NULL,12600,148,21),(609,'2025-08-03 10:30:00','completado',5,'Perfecto',6000,152,21),(610,'2025-08-06 16:00:00','cancelado',NULL,NULL,15750,151,21),(611,'2025-08-09 12:00:00','completado',NULL,NULL,21000,150,21),(612,'2025-08-12 17:00:00','completado',4,'Satisfactorio',12000,149,21),(613,'2025-08-15 09:30:00','confirmado',NULL,NULL,12600,147,21),(614,'2025-08-18 14:30:00','pendiente',NULL,NULL,12600,148,21),(615,'2025-08-22 10:00:00','cancelado',NULL,NULL,26250,149,21),(616,'2025-08-25 16:00:00','confirmado',NULL,NULL,21000,150,21),(617,'2025-08-29 11:30:00','pendiente',NULL,NULL,15750,151,21),(618,'2025-09-01 15:30:00','confirmado',NULL,NULL,10500,152,21),(619,'2025-09-04 09:00:00','cancelado',NULL,NULL,12600,147,21),(620,'2025-09-07 13:30:00','pendiente',NULL,NULL,12600,148,21),(621,'2025-09-11 10:30:00','confirmado',NULL,NULL,26250,149,21),(622,'2025-09-14 16:00:00','pendiente',NULL,NULL,21000,150,21),(623,'2025-09-18 12:00:00','cancelado',NULL,NULL,15750,151,21),(624,'2025-09-21 14:30:00','confirmado',NULL,NULL,10500,152,21),(625,'2025-09-25 09:30:00','pendiente',NULL,NULL,12600,147,21),(626,'2025-09-28 15:30:00','confirmado',NULL,NULL,12600,148,21),(627,'2025-10-02 10:00:00','cancelado',NULL,NULL,26250,149,21),(628,'2025-10-05 16:00:00','pendiente',NULL,NULL,21000,150,21),(629,'2025-10-09 12:00:00','confirmado',NULL,NULL,15750,151,21),(630,'2025-10-12 17:30:00','pendiente',NULL,NULL,10500,152,21),(631,'2025-07-14 08:30:00','completado',5,'Excelente tecnología',25000,153,22),(632,'2025-07-17 13:30:00','completado',NULL,NULL,21000,154,22),(633,'2025-07-19 10:00:00','cancelado',NULL,NULL,15750,155,22),(634,'2025-07-21 15:30:00','completado',4,'Buen trabajo',12000,156,22),(635,'2025-07-24 11:00:00','completado',NULL,NULL,21000,157,22),(636,'2025-07-26 16:00:00','completado',5,'Muy profesional',35000,158,22),(637,'2025-07-29 09:30:00','cancelado',NULL,NULL,8400,153,22),(638,'2025-08-01 14:00:00','completado',NULL,NULL,21000,154,22),(639,'2025-08-04 10:30:00','completado',4,'Satisfactorio',8000,156,22),(640,'2025-08-07 16:00:00','cancelado',NULL,NULL,21000,157,22),(641,'2025-08-10 12:00:00','completado',NULL,NULL,12600,158,22),(642,'2025-08-13 17:00:00','completado',5,'Perfecto',20000,155,22),(643,'2025-08-16 09:30:00','confirmado',NULL,NULL,8400,153,22),(644,'2025-08-19 14:30:00','pendiente',NULL,NULL,21000,154,22),(645,'2025-08-23 10:00:00','cancelado',NULL,NULL,15750,155,22),(646,'2025-08-26 16:00:00','confirmado',NULL,NULL,12600,156,22),(647,'2025-08-30 11:30:00','pendiente',NULL,NULL,21000,157,22),(648,'2025-09-02 15:30:00','confirmado',NULL,NULL,12600,158,22),(649,'2025-09-05 09:00:00','cancelado',NULL,NULL,8400,153,22),(650,'2025-09-08 13:30:00','pendiente',NULL,NULL,21000,154,22),(651,'2025-09-12 10:30:00','confirmado',NULL,NULL,15750,155,22),(652,'2025-09-15 16:00:00','pendiente',NULL,NULL,12600,156,22),(653,'2025-09-19 12:00:00','cancelado',NULL,NULL,21000,157,22),(654,'2025-09-22 14:30:00','confirmado',NULL,NULL,12600,158,22),(655,'2025-09-26 09:30:00','pendiente',NULL,NULL,8400,153,22),(656,'2025-09-29 15:30:00','confirmado',NULL,NULL,21000,154,22),(657,'2025-10-03 10:00:00','cancelado',NULL,NULL,15750,155,22),(658,'2025-10-06 16:00:00','pendiente',NULL,NULL,12600,156,22),(659,'2025-10-10 12:00:00','confirmado',NULL,NULL,21000,157,22),(660,'2025-10-13 17:30:00','pendiente',NULL,NULL,12600,158,22),(661,'2025-07-15 10:00:00','completado',4,'Buen servicio de seguridad',12000,159,23),(662,'2025-07-18 15:00:00','completado',NULL,NULL,15750,160,23),(663,'2025-07-20 11:30:00','cancelado',NULL,NULL,12600,161,23),(664,'2025-07-22 09:00:00','completado',5,'Excelente seguridad',30000,162,23),(665,'2025-07-25 14:00:00','completado',NULL,NULL,12600,163,23),(666,'2025-07-27 16:30:00','completado',4,'Muy bueno',8000,164,23),(667,'2025-07-30 10:00:00','cancelado',NULL,NULL,10500,159,23),(668,'2025-08-02 13:00:00','completado',NULL,NULL,15750,160,23),(669,'2025-08-05 09:30:00','completado',5,'Perfecto',15000,162,23),(670,'2025-08-08 15:00:00','cancelado',NULL,NULL,12600,163,23),(671,'2025-08-11 11:00:00','completado',NULL,NULL,15750,164,23),(672,'2025-08-14 16:00:00','completado',4,'Satisfactorio',5000,161,23),(673,'2025-08-17 09:30:00','confirmado',NULL,NULL,10500,159,23),(674,'2025-08-20 14:30:00','pendiente',NULL,NULL,15750,160,23),(675,'2025-08-24 10:00:00','cancelado',NULL,NULL,12600,161,23),(676,'2025-08-27 16:00:00','confirmado',NULL,NULL,21000,162,23),(677,'2025-08-31 11:30:00','pendiente',NULL,NULL,12600,163,23),(678,'2025-09-03 15:30:00','confirmado',NULL,NULL,15750,164,23),(679,'2025-09-06 09:00:00','cancelado',NULL,NULL,10500,159,23),(680,'2025-09-09 13:30:00','pendiente',NULL,NULL,15750,160,23),(681,'2025-09-13 10:30:00','confirmado',NULL,NULL,12600,161,23),(682,'2025-09-16 16:00:00','pendiente',NULL,NULL,21000,162,23),(683,'2025-09-20 12:00:00','cancelado',NULL,NULL,12600,163,23),(684,'2025-09-23 14:30:00','confirmado',NULL,NULL,15750,164,23),(685,'2025-09-27 09:30:00','pendiente',NULL,NULL,10500,159,23),(686,'2025-09-30 15:30:00','confirmado',NULL,NULL,15750,160,23),(687,'2025-10-04 10:00:00','cancelado',NULL,NULL,12600,161,23),(688,'2025-10-07 16:00:00','pendiente',NULL,NULL,21000,162,23),(689,'2025-10-11 12:00:00','confirmado',NULL,NULL,12600,163,23),(690,'2025-10-14 17:30:00','pendiente',NULL,NULL,15750,164,23),(691,'2025-07-16 08:00:00','completado',5,'Excelente veterinaria',5000,165,24),(692,'2025-07-19 13:00:00','completado',NULL,NULL,15750,166,24),(693,'2025-07-21 10:30:00','cancelado',NULL,NULL,31500,167,24),(694,'2025-07-23 15:00:00','completado',4,'Buen cuidado',2000,168,24),(695,'2025-07-26 11:00:00','completado',NULL,NULL,4200,169,24),(696,'2025-07-28 16:30:00','completado',5,'Muy profesional',15000,170,24),(697,'2025-07-31 09:00:00','cancelado',NULL,NULL,12600,165,24),(698,'2025-08-03 14:00:00','completado',NULL,NULL,15750,166,24),(699,'2025-08-06 10:30:00','completado',4,'Satisfactorio',4000,168,24),(700,'2025-08-09 16:00:00','cancelado',NULL,NULL,4200,169,24),(701,'2025-08-12 12:00:00','completado',NULL,NULL,8400,170,24),(702,'2025-08-15 17:00:00','completado',5,'Perfecto',6000,167,24),(703,'2025-08-18 09:30:00','confirmado',NULL,NULL,12600,165,24),(704,'2025-08-21 14:30:00','pendiente',NULL,NULL,15750,166,24),(705,'2025-08-25 10:00:00','cancelado',NULL,NULL,31500,167,24),(706,'2025-08-28 16:00:00','confirmado',NULL,NULL,26250,168,24),(707,'2025-09-01 11:30:00','pendiente',NULL,NULL,4200,169,24),(708,'2025-09-04 15:30:00','confirmado',NULL,NULL,8400,170,24),(709,'2025-09-07 09:00:00','cancelado',NULL,NULL,12600,165,24),(710,'2025-09-10 13:30:00','pendiente',NULL,NULL,15750,166,24),(711,'2025-09-14 10:30:00','confirmado',NULL,NULL,31500,167,24),(712,'2025-09-17 16:00:00','pendiente',NULL,NULL,26250,168,24),(713,'2025-09-21 12:00:00','cancelado',NULL,NULL,4200,169,24),(714,'2025-09-24 14:30:00','confirmado',NULL,NULL,8400,170,24),(715,'2025-09-28 09:30:00','pendiente',NULL,NULL,12600,165,24),(716,'2025-10-01 15:30:00','confirmado',NULL,NULL,15750,166,24),(717,'2025-10-05 10:00:00','cancelado',NULL,NULL,31500,167,24),(718,'2025-10-08 16:00:00','pendiente',NULL,NULL,26250,168,24),(719,'2025-10-12 12:00:00','confirmado',NULL,NULL,4200,169,24),(720,'2025-10-15 17:30:00','pendiente',NULL,NULL,8400,170,24),(721,'2025-07-17 09:30:00','completado',4,'Buen servicio de belleza',4000,171,25),(722,'2025-07-20 14:30:00','completado',NULL,NULL,10500,172,25),(723,'2025-07-22 11:00:00','cancelado',NULL,NULL,12600,173,25),(724,'2025-07-24 16:30:00','completado',5,'Excelente trabajo',10000,174,25),(725,'2025-07-27 10:00:00','completado',NULL,NULL,12600,175,25),(726,'2025-07-30 15:00:00','completado',4,'Muy bueno',8000,176,25),(727,'2025-08-02 09:30:00','cancelado',NULL,NULL,6300,171,25),(728,'2025-08-05 13:30:00','completado',NULL,NULL,10500,172,25),(729,'2025-08-08 10:30:00','completado',5,'Perfecto',12000,174,25),(730,'2025-08-11 16:00:00','cancelado',NULL,NULL,12600,175,25),(731,'2025-08-14 12:00:00','completado',NULL,NULL,8400,176,25),(732,'2025-08-17 17:00:00','completado',4,'Satisfactorio',8000,173,25),(733,'2025-08-20 09:30:00','confirmado',NULL,NULL,6300,171,25),(734,'2025-08-23 14:30:00','pendiente',NULL,NULL,10500,172,25),(735,'2025-08-27 10:00:00','cancelado',NULL,NULL,12600,173,25),(736,'2025-08-30 16:00:00','confirmado',NULL,NULL,8400,174,25),(737,'2025-09-03 11:30:00','pendiente',NULL,NULL,12600,175,25),(738,'2025-09-06 15:30:00','confirmado',NULL,NULL,8400,176,25),(739,'2025-09-09 09:00:00','cancelado',NULL,NULL,6300,171,25),(740,'2025-09-12 13:30:00','pendiente',NULL,NULL,10500,172,25),(741,'2025-09-16 10:30:00','confirmado',NULL,NULL,12600,173,25),(742,'2025-09-19 16:00:00','pendiente',NULL,NULL,8400,174,25),(743,'2025-09-23 12:00:00','cancelado',NULL,NULL,12600,175,25),(744,'2025-09-26 14:30:00','confirmado',NULL,NULL,8400,176,25),(745,'2025-09-30 09:30:00','pendiente',NULL,NULL,6300,171,25),(746,'2025-10-03 15:30:00','confirmado',NULL,NULL,10500,172,25),(747,'2025-10-07 10:00:00','cancelado',NULL,NULL,12600,173,25),(748,'2025-10-10 16:00:00','pendiente',NULL,NULL,8400,174,25),(749,'2025-10-14 12:00:00','confirmado',NULL,NULL,12600,175,25),(750,'2025-10-17 17:30:00','pendiente',NULL,NULL,8400,176,25),(751,'2025-07-18 08:30:00','completado',5,'Excelente coaching',6000,177,26),(752,'2025-07-21 13:30:00','completado',NULL,NULL,10500,178,26),(753,'2025-07-23 10:00:00','cancelado',NULL,NULL,6300,179,26),(754,'2025-07-25 15:30:00','completado',4,'Buen desarrollo',15000,180,26),(755,'2025-07-28 11:00:00','completado',NULL,NULL,15750,181,26),(756,'2025-07-31 16:00:00','completado',5,'Muy profesional',10000,182,26),(757,'2025-08-03 09:30:00','cancelado',NULL,NULL,15750,177,26),(758,'2025-08-06 14:00:00','completado',NULL,NULL,10500,178,26),(759,'2025-08-09 10:30:00','completado',4,'Satisfactorio',20000,180,26),(760,'2025-08-12 16:00:00','cancelado',NULL,NULL,15750,181,26),(761,'2025-08-15 12:00:00','completado',NULL,NULL,12600,182,26),(762,'2025-08-18 17:00:00','completado',5,'Perfecto',25000,179,26),(763,'2025-08-21 09:30:00','confirmado',NULL,NULL,15750,177,26),(764,'2025-08-24 14:30:00','pendiente',NULL,NULL,10500,178,26),(765,'2025-08-28 10:00:00','cancelado',NULL,NULL,6300,179,26),(766,'2025-08-31 16:00:00','confirmado',NULL,NULL,4200,180,26),(767,'2025-09-04 11:30:00','pendiente',NULL,NULL,15750,181,26),(768,'2025-09-07 15:30:00','confirmado',NULL,NULL,12600,182,26),(769,'2025-09-10 09:00:00','cancelado',NULL,NULL,15750,177,26),(770,'2025-09-13 13:30:00','pendiente',NULL,NULL,10500,178,26),(771,'2025-09-17 10:30:00','confirmado',NULL,NULL,6300,179,26),(772,'2025-09-20 16:00:00','pendiente',NULL,NULL,4200,180,26),(773,'2025-09-24 12:00:00','cancelado',NULL,NULL,15750,181,26),(774,'2025-09-27 14:30:00','confirmado',NULL,NULL,12600,182,26),(775,'2025-10-01 09:30:00','pendiente',NULL,NULL,15750,177,26),(776,'2025-10-04 15:30:00','confirmado',NULL,NULL,10500,178,26),(777,'2025-10-08 10:00:00','cancelado',NULL,NULL,6300,179,26),(778,'2025-10-11 16:00:00','pendiente',NULL,NULL,4200,180,26),(779,'2025-10-15 12:00:00','confirmado',NULL,NULL,15750,181,26),(780,'2025-10-18 17:30:00','pendiente',NULL,NULL,12600,182,26),(781,'2025-07-19 10:00:00','completado',4,'Buen servicio de traducción',8000,183,27),(782,'2025-07-22 15:00:00','completado',NULL,NULL,36750,184,27),(783,'2025-07-24 11:30:00','cancelado',NULL,NULL,8400,185,27),(784,'2025-07-26 09:00:00','completado',5,'Excelente traducción',15000,186,27),(785,'2025-07-29 14:00:00','completado',NULL,NULL,18900,187,27),(786,'2025-08-01 16:30:00','completado',4,'Muy bueno',8000,188,27),(787,'2025-08-04 10:00:00','cancelado',NULL,NULL,10500,183,27),(788,'2025-08-07 13:00:00','completado',NULL,NULL,36750,184,27),(789,'2025-08-10 09:30:00','completado',5,'Perfecto',6000,186,27),(790,'2025-08-13 15:00:00','cancelado',NULL,NULL,18900,187,27),(791,'2025-08-16 11:00:00','completado',NULL,NULL,12600,188,27),(792,'2025-08-19 16:00:00','completado',4,'Satisfactorio',12000,185,27),(793,'2025-08-22 09:30:00','confirmado',NULL,NULL,10500,183,27),(794,'2025-08-25 14:30:00','pendiente',NULL,NULL,36750,184,27),(795,'2025-08-29 10:00:00','cancelado',NULL,NULL,8400,185,27),(796,'2025-09-01 16:00:00','confirmado',NULL,NULL,6300,186,27),(797,'2025-09-05 11:30:00','pendiente',NULL,NULL,18900,187,27),(798,'2025-09-08 15:30:00','confirmado',NULL,NULL,12600,188,27),(799,'2025-09-11 09:00:00','cancelado',NULL,NULL,10500,183,27),(800,'2025-09-14 13:30:00','pendiente',NULL,NULL,36750,184,27),(801,'2025-09-18 10:30:00','confirmado',NULL,NULL,8400,185,27),(802,'2025-09-21 16:00:00','pendiente',NULL,NULL,6300,186,27),(803,'2025-09-25 12:00:00','cancelado',NULL,NULL,18900,187,27),(804,'2025-09-28 14:30:00','confirmado',NULL,NULL,12600,188,27),(805,'2025-10-02 09:30:00','pendiente',NULL,NULL,10500,183,27),(806,'2025-10-05 15:30:00','confirmado',NULL,NULL,36750,184,27),(807,'2025-10-09 10:00:00','cancelado',NULL,NULL,8400,185,27),(808,'2025-10-12 16:00:00','pendiente',NULL,NULL,6300,186,27),(809,'2025-10-16 12:00:00','confirmado',NULL,NULL,18900,187,27),(810,'2025-10-19 17:30:00','pendiente',NULL,NULL,12600,188,27),(811,'2025-07-20 08:00:00','completado',5,'Excelente desarrollo',12000,189,28),(812,'2025-07-23 13:00:00','completado',NULL,NULL,52500,190,28),(813,'2025-07-25 10:30:00','cancelado',NULL,NULL,31500,191,28),(814,'2025-07-27 15:00:00','completado',4,'Buen software',35000,192,28),(815,'2025-07-30 11:00:00','completado',NULL,NULL,21000,193,28),(816,'2025-08-02 16:30:00','completado',5,'Muy profesional',20000,194,28),(817,'2025-08-05 09:00:00','cancelado',NULL,NULL,10500,189,28),(818,'2025-08-08 14:00:00','completado',NULL,NULL,52500,190,28),(819,'2025-08-11 10:30:00','completado',4,'Satisfactorio',25000,192,28),(820,'2025-08-14 16:00:00','cancelado',NULL,NULL,21000,193,28),(821,'2025-08-17 12:00:00','completado',NULL,NULL,15750,194,28),(822,'2025-08-20 17:00:00','completado',5,'Perfecto',30000,191,28),(823,'2025-08-23 09:30:00','confirmado',NULL,NULL,10500,189,28),(824,'2025-08-26 14:30:00','pendiente',NULL,NULL,52500,190,28),(825,'2025-08-30 10:00:00','cancelado',NULL,NULL,31500,191,28),(826,'2025-09-02 16:00:00','confirmado',NULL,NULL,26250,192,28),(827,'2025-09-06 11:30:00','pendiente',NULL,NULL,21000,193,28),(828,'2025-09-09 15:30:00','confirmado',NULL,NULL,15750,194,28),(829,'2025-09-12 09:00:00','cancelado',NULL,NULL,10500,189,28),(830,'2025-09-15 13:30:00','pendiente',NULL,NULL,52500,190,28),(831,'2025-09-19 10:30:00','confirmado',NULL,NULL,31500,191,28),(832,'2025-09-22 16:00:00','pendiente',NULL,NULL,26250,192,28),(833,'2025-09-26 12:00:00','cancelado',NULL,NULL,21000,193,28),(834,'2025-09-29 14:30:00','confirmado',NULL,NULL,15750,194,28),(835,'2025-10-03 09:30:00','pendiente',NULL,NULL,10500,189,28),(836,'2025-10-06 15:30:00','confirmado',NULL,NULL,52500,190,28),(837,'2025-10-10 10:00:00','cancelado',NULL,NULL,31500,191,28),(838,'2025-10-13 16:00:00','pendiente',NULL,NULL,26250,192,28),(839,'2025-10-17 12:00:00','confirmado',NULL,NULL,21000,193,28),(840,'2025-10-20 17:30:00','pendiente',NULL,NULL,15750,194,28),(841,'2025-07-21 09:30:00','completado',4,'Buen marketing digital',15000,195,29),(842,'2025-07-24 14:30:00','completado',NULL,NULL,18900,196,29),(843,'2025-07-26 11:00:00','cancelado',NULL,NULL,8400,197,29),(844,'2025-07-28 16:30:00','completado',5,'Excelente campaña',20000,198,29),(845,'2025-07-31 10:00:00','completado',NULL,NULL,6300,199,29),(846,'2025-08-03 15:00:00','completado',4,'Muy bueno',30000,200,29),(847,'2025-08-06 09:30:00','cancelado',NULL,NULL,12600,195,29),(848,'2025-08-09 13:30:00','completado',NULL,NULL,18900,196,29),(849,'2025-08-12 10:30:00','completado',5,'Perfecto',12000,198,29),(850,'2025-08-15 16:00:00','cancelado',NULL,NULL,6300,199,29),(851,'2025-08-18 12:00:00','completado',NULL,NULL,8400,200,29),(852,'2025-08-21 17:00:00','completado',4,'Satisfactorio',25000,197,29),(853,'2025-08-24 09:30:00','confirmado',NULL,NULL,12600,195,29),(854,'2025-08-27 14:30:00','pendiente',NULL,NULL,18900,196,29),(855,'2025-08-31 10:00:00','cancelado',NULL,NULL,8400,197,29),(856,'2025-09-03 16:00:00','confirmado',NULL,NULL,6300,198,29),(857,'2025-09-07 11:30:00','pendiente',NULL,NULL,6300,199,29),(858,'2025-09-10 15:30:00','confirmado',NULL,NULL,8400,200,29),(859,'2025-09-13 09:00:00','cancelado',NULL,NULL,12600,195,29),(860,'2025-09-16 13:30:00','pendiente',NULL,NULL,18900,196,29),(861,'2025-09-20 10:30:00','confirmado',NULL,NULL,8400,197,29),(862,'2025-09-23 16:00:00','pendiente',NULL,NULL,6300,198,29),(863,'2025-09-27 12:00:00','cancelado',NULL,NULL,6300,199,29),(864,'2025-09-30 14:30:00','confirmado',NULL,NULL,8400,200,29),(865,'2025-10-04 09:30:00','pendiente',NULL,NULL,12600,195,29),(866,'2025-10-07 15:30:00','confirmado',NULL,NULL,18900,196,29),(867,'2025-10-11 10:00:00','cancelado',NULL,NULL,8400,197,29),(868,'2025-10-14 16:00:00','pendiente',NULL,NULL,6300,198,29),(869,'2025-10-18 12:00:00','confirmado',NULL,NULL,6300,199,29),(870,'2025-10-21 17:30:00','pendiente',NULL,NULL,8400,200,29),(871,'2025-07-22 08:30:00','completado',5,'Excelente arquitectura',40000,201,30),(872,'2025-07-25 13:30:00','completado',NULL,NULL,12600,202,30),(873,'2025-07-27 10:00:00','cancelado',NULL,NULL,8400,203,30),(874,'2025-07-29 15:30:00','completado',4,'Buen diseño',25000,204,30),(875,'2025-08-01 11:00:00','completado',NULL,NULL,8400,205,30),(876,'2025-08-04 16:00:00','completado',5,'Muy profesional',15000,206,30),(877,'2025-08-07 09:30:00','cancelado',NULL,NULL,6300,201,30),(878,'2025-08-10 14:00:00','completado',NULL,NULL,12600,202,30),(879,'2025-08-13 10:30:00','completado',4,'Satisfactorio',12000,204,30),(880,'2025-08-16 16:00:00','cancelado',NULL,NULL,8400,205,30),(881,'2025-08-19 12:00:00','completado',NULL,NULL,6300,206,30),(882,'2025-08-22 17:00:00','completado',5,'Perfecto',20000,203,30),(883,'2025-08-25 09:30:00','confirmado',NULL,NULL,6300,201,30),(884,'2025-08-28 14:30:00','pendiente',NULL,NULL,12600,202,30),(885,'2025-09-01 10:00:00','cancelado',NULL,NULL,8400,203,30),(886,'2025-09-04 16:00:00','confirmado',NULL,NULL,15750,204,30),(887,'2025-09-08 11:30:00','pendiente',NULL,NULL,8400,205,30),(888,'2025-09-11 15:30:00','confirmado',NULL,NULL,6300,206,30),(889,'2025-09-14 09:00:00','cancelado',NULL,NULL,6300,201,30),(890,'2025-09-17 13:30:00','pendiente',NULL,NULL,12600,202,30),(891,'2025-09-21 10:30:00','confirmado',NULL,NULL,8400,203,30),(892,'2025-09-24 16:00:00','pendiente',NULL,NULL,15750,204,30),(893,'2025-09-28 12:00:00','cancelado',NULL,NULL,8400,205,30),(894,'2025-10-01 14:30:00','confirmado',NULL,NULL,6300,206,30),(895,'2025-10-05 09:30:00','pendiente',NULL,NULL,6300,201,30),(896,'2025-10-08 15:30:00','confirmado',NULL,NULL,12600,202,30),(897,'2025-10-12 10:00:00','cancelado',NULL,NULL,8400,203,30),(898,'2025-10-15 16:00:00','pendiente',NULL,NULL,15750,204,30),(899,'2025-10-19 12:00:00','confirmado',NULL,NULL,8400,205,30),(900,'2025-10-22 17:30:00','pendiente',NULL,NULL,6300,206,30);


