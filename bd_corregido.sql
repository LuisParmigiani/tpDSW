-- Script corregido para poblar la base de datos HomeService
-- Seguir el orden de inserción respetando las foreign keys

USE `homeservice`;

-- 1. Insertar ZONAS
INSERT INTO `zona` (`descripcion_zona`) VALUES
('Centro'),
('Norte'),
('Sur'),
('Este'),
('Oeste');

-- 2. Insertar TIPOS DE SERVICIO
INSERT INTO `tipo_servicio` (`nombre_tipo`, `descripcion_tipo`) VALUES
('Limpieza', 'Servicios de limpieza doméstica y empresarial'),
('Plomería', 'Instalación y reparación de sistemas de agua y gas'),
('Electricidad', 'Instalación y reparación de sistemas eléctricos'),
('Jardinería', 'Mantenimiento de jardines y espacios verdes'),
('Pintura', 'Servicios de pintura interior y exterior'),
('Carpintería', 'Trabajos en madera y muebles'),
('Albañilería', 'Construcción y reparación de mampostería'),
('Cerrajería', 'Servicios de cerrajería y seguridad'),
('Climatización', 'Instalación y mantenimiento de aires acondicionados'),
('Mudanzas', 'Servicios de mudanzas y transporte'),
('Mecánica', 'Reparación de electrodomésticos'),
('Tapicería', 'Reparación y tapizado de muebles'),
('Herrería', 'Trabajos en hierro y metales'),
('Vidriería', 'Instalación y reparación de vidrios'),
('Cocina', 'Servicios de catering y cocina doméstica');

-- 3. Insertar TAREAS
INSERT INTO `tarea` (`nombre_tarea`, `descripcion_tarea`, `duracion_tarea`, `tipo_servicio_id`) VALUES
-- Limpieza
('Limpieza General', 'Limpieza completa del hogar', 180, 1),
('Limpieza Profunda', 'Limpieza exhaustiva con productos especializados', 300, 1),
('Limpieza Post-Obra', 'Limpieza después de construcción o remodelación', 240, 1),
('Limpieza de Oficinas', 'Limpieza de espacios comerciales', 120, 1),
-- Plomería
('Destapado de Cañerías', 'Desobstrucción de desagües y cañerías', 90, 2),
('Reparación de Canillas', 'Arreglo de grifos y canillas', 60, 2),
('Instalación de Inodoro', 'Colocación de sanitarios', 120, 2),
('Arreglo de Pérdidas', 'Reparación de filtraciones', 90, 2),
-- Electricidad
('Instalación de Luces', 'Colocación de luminarias', 90, 3),
('Reparación de Enchufes', 'Arreglo de tomacorrientes', 60, 3),
('Instalación de Ventiladores', 'Colocación de ventiladores de techo', 120, 3),
('Revisión Eléctrica', 'Inspección general del sistema eléctrico', 90, 3),
-- Jardinería
('Poda de Árboles', 'Corte y mantenimiento de árboles', 120, 4),
('Corte de Césped', 'Mantenimiento del césped', 60, 4),
('Plantación', 'Siembra y plantación de especies', 90, 4),
('Diseño de Jardín', 'Planificación y diseño paisajístico', 180, 4),
-- Pintura
('Pintura Interior', 'Pintura de ambientes interiores', 480, 5),
('Pintura Exterior', 'Pintura de fachadas y exteriores', 600, 5),
('Pintura de Muebles', 'Restauración y pintura de mobiliario', 240, 5),
('Empapelado', 'Colocación de papel tapiz', 300, 5),
-- Carpintería
('Fabricación de Muebles', 'Construcción de muebles a medida', 720, 6),
('Reparación de Puertas', 'Arreglo de puertas y marcos', 120, 6),
('Instalación de Estantes', 'Colocación de repisas y estanterías', 90, 6),
('Restauración de Muebles', 'Reparación y restauración de mobiliario', 360, 6),
-- Albañilería
('Construcción de Paredes', 'Levantamiento de mampostería', 480, 7),
('Reparación de Grietas', 'Arreglo de fisuras en paredes', 180, 7),
('Colocación de Cerámicos', 'Instalación de revestimientos', 360, 7),
('Reparación de Techos', 'Arreglo de techos y cubiertas', 240, 7),
-- Cerrajería
('Cambio de Cerraduras', 'Reemplazo de sistemas de cierre', 90, 8),
('Apertura de Puertas', 'Servicio de emergencia para puertas', 45, 8),
('Instalación de Rejas', 'Colocación de sistemas de seguridad', 240, 8),
('Duplicado de Llaves', 'Copia de llaves y control de acceso', 30, 8),
-- Climatización
('Instalación de Aire', 'Colocación de equipos de aire acondicionado', 180, 9),
('Mantenimiento de Aire', 'Limpieza y mantenimiento de equipos', 90, 9),
('Reparación de Aire', 'Arreglo de equipos de climatización', 120, 9),
('Carga de Gas', 'Recarga de gas refrigerante', 60, 9),
-- Mudanzas
('Mudanza Local', 'Transporte dentro de la ciudad', 360, 10),
('Mudanza Larga Distancia', 'Transporte a otras ciudades', 720, 10),
('Embalaje', 'Preparación y embalaje de objetos', 240, 10),
('Montaje de Muebles', 'Armado de muebles en destino', 180, 10),
-- Mecánica
('Reparación de Lavarropas', 'Arreglo de máquinas lavadoras', 120, 11),
('Reparación de Heladeras', 'Arreglo de refrigeradores', 90, 11),
('Reparación de Microondas', 'Arreglo de hornos microondas', 60, 11),
('Reparación de Cocinas', 'Arreglo de cocinas y hornos', 120, 11),
-- Tapicería
('Tapizado de Sillas', 'Renovación de tapicería de sillas', 180, 12),
('Tapizado de Sillones', 'Renovación de tapicería de sillones', 240, 12),
('Reparación de Colchones', 'Arreglo y mantenimiento de colchones', 120, 12),
('Confección de Cortinas', 'Elaboración de cortinas a medida', 240, 12),
-- Herrería
('Soldadura', 'Trabajos de soldadura en metales', 120, 13),
('Fabricación de Rejas', 'Construcción de rejas de seguridad', 480, 13),
('Reparación de Portones', 'Arreglo de portones metálicos', 180, 13),
('Instalación de Barandas', 'Colocación de barandas y pasamanos', 240, 13),
-- Vidriería
('Instalación de Vidrios', 'Colocación de vidrios planos', 90, 14),
('Reparación de Ventanas', 'Arreglo de marcos y vidrios', 120, 14),
('Instalación de Espejos', 'Colocación de espejos', 60, 14),
('Vidrios de Seguridad', 'Instalación de vidrios templados', 120, 14),
-- Cocina
('Catering para Eventos', 'Servicios de comida para eventos', 360, 15),
('Cocina Doméstica', 'Preparación de comidas en el hogar', 120, 15),
('Clases de Cocina', 'Enseñanza de técnicas culinarias', 180, 15),
('Preparación de Viandas', 'Elaboración de comidas para llevar', 240, 15);

-- 4. Insertar USUARIOS (Clientes y Prestadores)
INSERT INTO `usuario` (`mail`, `contrasena`, `tipo_doc`, `numero_doc`, `telefono`, `nombre`, `apellido`, `direccion`, `nombre_fantasia`, `descripcion`, `foto`) VALUES
-- CLIENTES (IDs 1-15: tienen telefono, nombre, apellido, direccion - NO tienen nombre_fantasia ni descripcion)
('maria.gonzalez@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '12345678', '341-5551234', 'María', 'González', 'Av. Pellegrini 1250', NULL, NULL, 'perfil1.jpg'),
('carlos.rodriguez@hotmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '23456789', '341-5552345', 'Carlos', 'Rodríguez', 'San Martín 850', NULL, NULL, 'perfil2.jpg'),
('ana.martinez@yahoo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '34567890', '341-5553456', 'Ana', 'Martínez', 'Córdoba 1500', NULL, NULL, 'perfil3.jpg'),
('luis.fernandez@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '45678901', '341-5554567', 'Luis', 'Fernández', 'Oroño 780', NULL, NULL, 'perfil4.jpg'),
('sofia.lopez@outlook.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '56789012', '341-5555678', 'Sofía', 'López', 'Rioja 650', NULL, NULL, 'perfil5.jpg'),
('diego.santos@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '67890123', '341-5556789', 'Diego', 'Santos', 'Sarmiento 1200', NULL, NULL, 'perfil6.jpg'),
('patricia.silva@hotmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '78901234', '341-5557890', 'Patricia', 'Silva', 'Mendoza 450', NULL, NULL, 'perfil7.jpg'),
('roberto.perez@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '89012345', '341-5558901', 'Roberto', 'Pérez', 'Montevideo 980', NULL, NULL, 'perfil8.jpg'),
('valeria.morales@yahoo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '90123456', '341-5559012', 'Valeria', 'Morales', 'Maipú 1150', NULL, NULL, 'perfil9.jpg'),
('fernando.castro@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '01234567', '341-5550123', 'Fernando', 'Castro', 'Laprida 730', NULL, NULL, 'perfil10.jpg'),
('lucia.herrera@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '11223344', '341-5551122', 'Lucía', 'Herrera', 'Bv. Oroño 1420', NULL, NULL, 'perfil11.jpg'),
('martin.silva@hotmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22334455', '341-5552233', 'Martín', 'Silva', 'Junín 980', NULL, NULL, 'perfil12.jpg'),
('carolina.lopez@yahoo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '33445566', '341-5553344', 'Carolina', 'López', 'Italia 1650', NULL, NULL, 'perfil13.jpg'),
('pablo.martinez@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '44556677', '341-5554455', 'Pablo', 'Martínez', 'Francia 890', NULL, NULL, 'perfil14.jpg'),
('natalia.rodriguez@outlook.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '55667788', '341-5555566', 'Natalia', 'Rodríguez', 'Paraguay 1230', NULL, NULL, 'perfil15.jpg');

-- PRESTADORES (IDs 16-35: tienen nombre_fantasia y descripcion - también tienen telefono, nombre, apellido, direccion)
INSERT INTO `usuario` (`mail`, `contrasena`, `tipo_doc`, `numero_doc`, `telefono`, `nombre`, `apellido`, `direccion`, `nombre_fantasia`, `descripcion`, `foto`) VALUES
('limpieza.rosario@gmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '11111111', '341-6661111', 'marta', 'jiménez', 'tucumán 1400', 'limpieza total', 'servicios de limpieza profesional con 15 años de experiencia', 'empresa1.jpg'),
('plomero.raul@hotmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '22222222', '341-6662222', 'raúl', 'herrera', 'santa fe 2200', 'plomería herrera', 'plomero matriculado con atención las 24 horas', 'empresa2.jpg'),
('electricista.jose@gmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '33333333', '341-6663333', 'josé', 'ramírez', 'belgrano 1800', 'electricidad ramírez', 'electricista matriculado, instalaciones y reparaciones', 'empresa3.jpg'),
('jardinero.miguel@yahoo.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '44444444', '341-6664444', 'miguel', 'vega', 'zeballos 950', 'jardines vega', 'diseño y mantenimiento de jardines y parques', 'empresa4.jpg'),
('pintor.antonio@gmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '55555555', '341-6665555', 'antonio', 'moreno', 'pueyrredón 1600', 'pintura moreno', 'pintor profesional, trabajos en altura y fachadas', 'empresa5.jpg'),
('carpintero.pablo@hotmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '66666666', '341-6666666', 'pablo', 'ruiz', 'urquiza 1300', 'carpintería ruiz', 'muebles a medida y restauración', 'empresa6.jpg'),
('albanil.ricardo@gmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '77777777', '341-6667777', 'ricardo', 'díaz', 'alvear 1100', 'construcciones díaz', 'albañilería y construcción en general', 'empresa7.jpg'),
('cerrajero.omar@yahoo.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '88888888', '341-6668888', 'omar', 'flores', 'cochabamba 800', 'cerrajería flores', 'cerrajería y seguridad, servicio de emergencia', 'empresa8.jpg'),
('clima.tecnico@gmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '99999999', '341-6669999', 'técnico', 'gómez', 'mitre 1900', 'clima service', 'instalación y mantenimiento de equipos de climatización', 'empresa9.jpg'),
('mudanzas.pedro@hotmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '10101010', '341-6661010', 'pedro', 'ortega', 'jujuy 1700', 'mudanzas ortega', 'mudanzas locales y a larga distancia', 'empresa10.jpg'),
('mecanico.hugo@gmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '12121212', '341-6661212', 'hugo', 'vargas', 'san luis 1500', 'reparaciones vargas', 'reparación de electrodomésticos a domicilio', 'empresa11.jpg'),
('tapicero.manuel@yahoo.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '13131313', '341-6661313', 'manuel', 'aguirre', 'catamarca 1200', 'tapicería aguirre', 'tapicería y restauración de muebles', 'empresa12.jpg'),
('herrero.daniel@gmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '14141414', '341-6661414', 'daniel', 'medina', 'salta 1600', 'herrería medina', 'trabajos en hierro y soldadura', 'empresa13.jpg'),
('vidriero.carlos@hotmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '15151515', '341-6661515', 'carlos', 'navarro', 'entre ríos 1400', 'vidriería navarro', 'instalación y reparación de vidrios', 'empresa14.jpg'),
('chef.patricia@gmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '16161616', '341-6661616', 'patricia', 'delgado', 'corrientes 1800', 'cocina delgado', 'servicios de catering y cocina doméstica', 'empresa15.jpg'),
('limpieza.ana@yahoo.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '17171717', '341-6661717', 'ana', 'sosa', 'callao 1000', 'clean house', 'limpieza residencial y comercial', 'empresa16.jpg'),
('plomero.sergio@gmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '18181818', '341-6661818', 'sergio', 'peña', 'dorrego 1300', 'plomería express', 'servicios de plomería rápida', 'empresa17.jpg'),
('electricista.mario@hotmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '19191919', '341-6661919', 'mario', 'ibáñez', 'balcarce 1500', 'electricidad 24hs', 'electricista con servicio de emergencia', 'empresa18.jpg'),
('jardinero.fernando@gmail.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '20202020', '341-6662020', 'fernando', 'ramos', 'moreno 1700', 'verde total', 'paisajismo y mantenimiento de jardines', 'empresa19.jpg'),
('pintor.gabriel@yahoo.com', '$2y$10$92ixunpkjo0roq5bymi.ye4okoea3ro9llc/.og/at2.uhewg/igi', 'dni', '21212121', '341-6662121', 'gabriel', 'torres', 'wheelwright 1200', 'pintura profesional', 'pintura interior y exterior de calidad', 'empresa20.jpg'),
('plomeria.rosario1@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230001', '341-7771001', 'Juan', 'Pérez', 'San Juan 1001', 'Plomería Rápida', 'Soluciones urgentes en plomería', 'plomeria1.jpg'),
('plomeria.rosario2@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230002', '341-7771002', 'Luis', 'Gómez', 'San Luis 1002', 'Plomería Central', 'Plomería profesional en el centro', 'plomeria2.jpg'),
('plomeria.rosario3@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230003', '341-7771003', 'Carlos', 'Fernández', 'San Martín 1003', 'Plomería Express 24hs', 'Atención inmediata las 24 horas', 'plomeria3.jpg'),
('plomeria.rosario4@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230004', '341-7771004', 'Miguel', 'López', 'Córdoba 1004', 'Plomería del Norte', 'Especialistas en zona norte', 'plomeria4.jpg'),
('plomeria.rosario5@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230005', '341-7771005', 'Sergio', 'Ramírez', 'Oroño 1005', 'Plomería Sur', 'Servicios de plomería en zona sur', 'plomeria5.jpg'),
('plomeria.rosario6@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230006', '341-7771006', 'Roberto', 'Sosa', 'Italia 1006', 'Plomería Total', 'Plomería integral para el hogar', 'plomeria6.jpg'),
('plomeria.rosario7@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230007', '341-7771007', 'Martín', 'Morales', 'Paraguay 1007', 'Plomería y Gas', 'Instalaciones y reparaciones de gas y agua', 'plomeria7.jpg'),
('plomeria.rosario8@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230008', '341-7771008', 'Javier', 'Navarro', 'Maipú 1008', 'Plomería Económica', 'Precios accesibles y calidad', 'plomeria8.jpg'),
('plomeria.rosario9@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230009', '341-7771009', 'Pablo', 'Castro', 'Montevideo 1009', 'Plomería Profesional', 'Plomeros matriculados', 'plomeria9.jpg'),
('plomeria.rosario10@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230010', '341-7771010', 'Diego', 'Martínez', 'Laprida 1010', 'Plomería Rosario', 'Servicio en toda la ciudad', 'plomeria10.jpg'),
('plomeria.rosario11@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230011', '341-7771011', 'Andrés', 'Silva', 'Santa Fe 1011', 'Plomería Familiar', 'Atención personalizada y familiar', 'plomeria11.jpg'),
('plomeria.rosario12@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230012', '341-7771012', 'Esteban', 'García', 'Junín 1012', 'Plomería Urbana', 'Soluciones urbanas de plomería', 'plomeria12.jpg'),
('plomeria.rosario13@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230013', '341-7771013', 'Ramiro', 'Vega', 'Francia 1013', 'Plomería del Oeste', 'Especialistas en zona oeste', 'plomeria13.jpg'),
('plomeria.rosario14@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DNI', '22230014', '341-7771014', 'Matías', 'Díaz', 'Wheelwright 1014', 'Plomería Premium', 'Servicios premium de plomería', 'plomeria14.jpg');

-- 5. Insertar SERVICIOS (cada servicio pertenece a UN único prestador con su tarifa base)
INSERT INTO `servicio` (`precio`, `tarea_id`, `usuario_id`) VALUES
-- Servicios de Limpieza Total (prestador usuario 16)
(15000, 1, 16), (25000, 2, 16), (35000, 3, 16), (12000, 4, 16),
-- Servicios de Plomería Herrera (prestador usuario 17)
(8000, 5, 17), (5000, 6, 17), (18000, 7, 17), (7000, 8, 17),
-- Servicios de Electricidad Ramírez (prestador usuario 18)
(12000, 9, 18), (6000, 10, 18), (15000, 11, 18), (10000, 12, 18),
-- Servicios de Jardines Vega (prestador usuario 19)
(20000, 13, 19), (8000, 14, 19), (12000, 15, 19), (30000, 16, 19),
-- Servicios de Pintura Moreno (prestador usuario 20)
(45000, 17, 20), (60000, 18, 20), (25000, 19, 20), (35000, 20, 20),
-- Servicios de Carpintería Ruiz (prestador usuario 21)
(80000, 21, 21), (15000, 22, 21), (10000, 23, 21), (50000, 24, 21),
-- Servicios de Construcciones Díaz (prestador usuario 22)
(55000, 25, 22), (20000, 26, 22), (40000, 27, 22), (30000, 28, 22),
-- Servicios de Cerrajería Flores (prestador usuario 23)
(12000, 29, 23), (8000, 30, 23), (35000, 31, 23), (3000, 32, 23),
-- Servicios de Clima Service (prestador usuario 24)
(45000, 33, 24), (8000, 34, 24), (25000, 35, 24), (6000, 36, 24),
-- Servicios de Mudanzas Ortega (prestador usuario 25)
(25000, 37, 25), (50000, 38, 25), (15000, 39, 25), (12000, 40, 25),
-- Servicios de Reparaciones Vargas (prestador usuario 26)
(18000, 41, 26), (22000, 42, 26), (12000, 43, 26), (20000, 44, 26),
-- Servicios de Tapicería Aguirre (prestador usuario 27)
(15000, 45, 27), (25000, 46, 27), (18000, 47, 27), (20000, 48, 27),
-- Servicios de Herrería Medina (prestador usuario 28)
(15000, 49, 28), (60000, 50, 28), (25000, 51, 28), (30000, 52, 28),
-- Servicios de Vidriería Navarro (prestador usuario 29)
(8000, 53, 29), (12000, 54, 29), (6000, 55, 29), (15000, 56, 29),
-- Servicios de Cocina Delgado (prestador usuario 30)
(40000, 57, 30), (12000, 58, 30), (15000, 59, 30), (20000, 60, 30),
-- Servicios adicionales de Clean House (prestador usuario 31)
(14000, 1, 31), (24000, 2, 31), (11000, 4, 31),
-- Servicios adicionales de Plomería Express (prestador usuario 32)
(7500, 5, 32), (4500, 6, 32), (6500, 8, 32),
-- Servicios adicionales de Electricidad 24hs (prestador usuario 33)
(11000, 9, 33), (5500, 10, 33), (9500, 12, 33),
-- Servicios adicionales de Verde Total (prestador usuario 34)
(19000, 13, 34), (7500, 14, 34), (11500, 15, 34),
-- Servicios adicionales de Pintura Profesional (prestador usuario 35)
(43000, 17, 35), (58000, 18, 35), (24000, 19, 35);

-- 6. Insertar HORARIOS para prestadores
INSERT INTO `horario` (`dia_semana`, `hora_desde`, `hora_hasta`, `usuario_id`) VALUES
-- Limpieza Total (usuario 16) - Lunes a Viernes + Sábado medio día
(1, '08:00:00', '18:00:00', 16), (2, '08:00:00', '18:00:00', 16), (3, '08:00:00', '18:00:00', 16), (4, '08:00:00', '18:00:00', 16), (5, '08:00:00', '18:00:00', 16), (6, '08:00:00', '14:00:00', 16),
-- Plomería Herrera (usuario 17) - Todos los días
(1, '07:00:00', '19:00:00', 17), (2, '07:00:00', '19:00:00', 17), (3, '07:00:00', '19:00:00', 17), (4, '07:00:00', '19:00:00', 17), (5, '07:00:00', '19:00:00', 17), (6, '07:00:00', '19:00:00', 17), (7, '08:00:00', '18:00:00', 17),
-- Electricidad Ramírez (usuario 18) - Lunes a Sábado
(1, '08:00:00', '17:00:00', 18), (2, '08:00:00', '17:00:00', 18), (3, '08:00:00', '17:00:00', 18), (4, '08:00:00', '17:00:00', 18), (5, '08:00:00', '17:00:00', 18), (6, '08:00:00', '15:00:00', 18),
-- Jardines Vega (usuario 19) - Martes a Sábado
(2, '07:00:00', '16:00:00', 19), (3, '07:00:00', '16:00:00', 19), (4, '07:00:00', '16:00:00', 19), (5, '07:00:00', '16:00:00', 19), (6, '07:00:00', '16:00:00', 19),
-- Pintura Moreno (usuario 20) - Lunes a Viernes
(1, '08:00:00', '17:00:00', 20), (2, '08:00:00', '17:00:00', 20), (3, '08:00:00', '17:00:00', 20), (4, '08:00:00', '17:00:00', 20), (5, '08:00:00', '17:00:00', 20),
-- Carpintería Ruiz (usuario 21) - Lunes a Viernes
(1, '08:00:00', '18:00:00', 21), (2, '08:00:00', '18:00:00', 21), (3, '08:00:00', '18:00:00', 21), (4, '08:00:00', '18:00:00', 21), (5, '08:00:00', '18:00:00', 21),
-- Construcciones Díaz (usuario 22) - Lunes a Sábado
(1, '07:00:00', '17:00:00', 22), (2, '07:00:00', '17:00:00', 22), (3, '07:00:00', '17:00:00', 22), (4, '07:00:00', '17:00:00', 22), (5, '07:00:00', '17:00:00', 22), (6, '07:00:00', '15:00:00', 22),
-- Cerrajería Flores (usuario 23) - Todos los días (emergencia)
(1, '00:00:00', '23:59:59', 23), (2, '00:00:00', '23:59:59', 23), (3, '00:00:00', '23:59:59', 23), (4, '00:00:00', '23:59:59', 23), (5, '00:00:00', '23:59:59', 23), (6, '00:00:00', '23:59:59', 23), (7, '00:00:00', '23:59:59', 23),
-- Clima Service (usuario 24) - Lunes a Sábado
(1, '08:00:00', '18:00:00', 24), (2, '08:00:00', '18:00:00', 24), (3, '08:00:00', '18:00:00', 24), (4, '08:00:00', '18:00:00', 24), (5, '08:00:00', '18:00:00', 24), (6, '08:00:00', '16:00:00', 24),
-- Mudanzas Ortega (usuario 25) - Lunes a Sábado
(1, '07:00:00', '19:00:00', 25), (2, '07:00:00', '19:00:00', 25), (3, '07:00:00', '19:00:00', 25), (4, '07:00:00', '19:00:00', 25), (5, '07:00:00', '19:00:00', 25), (6, '07:00:00', '17:00:00', 25),
-- Reparaciones Vargas (usuario 26) - Lunes a Viernes
(1, '08:00:00', '18:00:00', 26), (2, '08:00:00', '18:00:00', 26), (3, '08:00:00', '18:00:00', 26), (4, '08:00:00', '18:00:00', 26), (5, '08:00:00', '18:00:00', 26),
-- Tapicería Aguirre (usuario 27) - Lunes a Sábado
(1, '08:00:00', '17:00:00', 27), (2, '08:00:00', '17:00:00', 27), (3, '08:00:00', '17:00:00', 27), (4, '08:00:00', '17:00:00', 27), (5, '08:00:00', '17:00:00', 27), (6, '08:00:00', '15:00:00', 27),
-- Herrería Medina (usuario 28) - Lunes a Viernes
(1, '07:00:00', '17:00:00', 28), (2, '07:00:00', '17:00:00', 28), (3, '07:00:00', '17:00:00', 28), (4, '07:00:00', '17:00:00', 28), (5, '07:00:00', '17:00:00', 28),
-- Vidriería Navarro (usuario 29) - Lunes a Sábado
(1, '08:00:00', '18:00:00', 29), (2, '08:00:00', '18:00:00', 29), (3, '08:00:00', '18:00:00', 29), (4, '08:00:00', '18:00:00', 29), (5, '08:00:00', '18:00:00', 29), (6, '08:00:00', '16:00:00', 29),
-- Cocina Delgado (usuario 30) - Martes a Domingo
(2, '09:00:00', '22:00:00', 30), (3, '09:00:00', '22:00:00', 30), (4, '09:00:00', '22:00:00', 30), (5, '09:00:00', '22:00:00', 30), (6, '09:00:00', '23:00:00', 30), (7, '09:00:00', '23:00:00', 30),
-- Clean House (usuario 31) - Lunes a Sábado
(1, '08:00:00', '17:00:00', 31), (2, '08:00:00', '17:00:00', 31), (3, '08:00:00', '17:00:00', 31), (4, '08:00:00', '17:00:00', 31), (5, '08:00:00', '17:00:00', 31), (6, '08:00:00', '15:00:00', 31),
-- Plomería Express (usuario 32) - Todos los días
(1, '06:00:00', '22:00:00', 32), (2, '06:00:00', '22:00:00', 32), (3, '06:00:00', '22:00:00', 32), (4, '06:00:00', '22:00:00', 32), (5, '06:00:00', '22:00:00', 32), (6, '06:00:00', '22:00:00', 32), (7, '08:00:00', '20:00:00', 32),
-- Electricidad 24hs (usuario 33) - Todos los días
(1, '00:00:00', '23:59:59', 33), (2, '00:00:00', '23:59:59', 33), (3, '00:00:00', '23:59:59', 33), (4, '00:00:00', '23:59:59', 33), (5, '00:00:00', '23:59:59', 33), (6, '00:00:00', '23:59:59', 33), (7, '00:00:00', '23:59:59', 33),
-- Verde Total (usuario 34) - Lunes a Sábado
(1, '07:00:00', '16:00:00', 34), (2, '07:00:00', '16:00:00', 34), (3, '07:00:00', '16:00:00', 34), (4, '07:00:00', '16:00:00', 34), (5, '07:00:00', '16:00:00', 34), (6, '07:00:00', '15:00:00', 34),
-- Pintura Profesional (usuario 35) - Lunes a Viernes
(1, '08:00:00', '17:00:00', 35), (2, '08:00:00', '17:00:00', 35), (3, '08:00:00', '17:00:00', 35), (4, '08:00:00', '17:00:00', 35), (5, '08:00:00', '17:00:00', 35);

-- 7. Insertar relaciones USUARIO_ZONAS (prestadores con zonas donde trabajan)
INSERT INTO `usuario_zonas` (`usuario_id`, `zona_id`) VALUES
-- Limpieza Total (usuario 16) - Centro, Norte
(16, 1), (16, 2),
-- Plomería Herrera (usuario 17) - Todas las zonas (servicio 24hs)
(17, 1), (17, 2), (17, 3), (17, 4), (17, 5),
-- Electricidad Ramírez (usuario 18) - Centro, Norte, Sur
(18, 1), (18, 2), (18, 3),
-- Jardines Vega (usuario 19) - Norte, Sur
(19, 2), (19, 3),
-- Pintura Moreno (usuario 20) - Centro, Oeste
(20, 1), (20, 5),
-- Carpintería Ruiz (usuario 21) - Centro, Norte, Este
(21, 1), (21, 2), (21, 4),
-- Construcciones Díaz (usuario 22) - Norte, Sur, Este, Oeste
(22, 2), (22, 3), (22, 4), (22, 5),
-- Cerrajería Flores (usuario 23) - Todas las zonas (servicio de emergencia)
(23, 1), (23, 2), (23, 3), (23, 4), (23, 5),
-- Clima Service (usuario 24) - Centro, Norte, Sur
(24, 1), (24, 2), (24, 3),
-- Mudanzas Ortega (usuario 25) - Todas las zonas principales
(25, 1), (25, 2), (25, 3), (25, 4), (25, 5),
-- Reparaciones Vargas (usuario 26) - Centro, Norte
(26, 1), (26, 2),
-- Tapicería Aguirre (usuario 27) - Centro, Sur, Oeste
(27, 1), (27, 3), (27, 5),
-- Herrería Medina (usuario 28) - Norte, Este, Oeste
(28, 2), (28, 4), (28, 5),
-- Vidriería Navarro (usuario 29) - Centro, Sur, Este
(29, 1), (29, 3), (29, 4),
-- Cocina Delgado (usuario 30) - Centro, Norte
(30, 1), (30, 2),
-- Clean House (usuario 31) - Centro, Sur, Oeste
(31, 1), (31, 3), (31, 5),
-- Plomería Express (usuario 32) - Centro, Norte, Sur, Este
(32, 1), (32, 2), (32, 3), (32, 4),
-- Electricidad 24hs (usuario 33) - Todas las zonas (servicio 24hs)
(33, 1), (33, 2), (33, 3), (33, 4), (33, 5),
-- Verde Total (usuario 34) - Norte, Sur
(34, 2), (34, 3),
-- Pintura Profesional (usuario 35) - Centro, Norte, Este
(35, 1), (35, 2), (35, 4),
-- Plomería Rápida (usuario 36) - Norte
(36, 2),
-- Plomería Central (usuario 37 - Norte)
(37, 2),
-- Plomería Express 24hs (usuario 38 - Norte)
(38, 2),
-- Plomería del Norte (usuario 39 - Norte)
(39, 2),
-- Plomería Sur (usuario 40 - Norte)
(40, 2),
-- Plomería Total (usuario 41 - Norte)
(41, 2),
-- Plomería y Gas (usuario 42 - Norte)
(42, 2),
-- Plomería Económica (usuario 43 - Norte)
(43, 2),
-- Plomería Profesional (usuario 44 - Norte)
(44, 2),
-- Plomería Rosario (usuario 45 - Norte)
(45, 2),
-- Plomería Familiar (usuario 46 - Norte)
(46, 2),
-- Plomería Urbana (usuario 47 - Norte)
(47, 2),
-- Plomería del Oeste (usuario 48 - Norte)
(48, 2),
-- Plomería Premium (usuario 49 - Norte)
(49, 2);

-- 8. Insertar relaciones USUARIO_TIPOS_DE_SERVICIO (prestadores con sus tipos de servicio)
INSERT INTO `usuario_tipos_de_servicio` (`usuario_id`, `tipo_servicio_id`) VALUES
-- Limpieza Total (usuario 16) - Limpieza
(16, 1),
-- Plomería Herrera (usuario 17) - Plomería
(17, 2),
-- Electricidad Ramírez (usuario 18) - Electricidad
(18, 3),
-- Jardines Vega (usuario 19) - Jardinería
(19, 4),
-- Pintura Moreno (usuario 20) - Pintura
(20, 5),
-- Carpintería Ruiz (usuario 21) - Carpintería
(21, 6),
-- Construcciones Díaz (usuario 22) - Albañilería
(22, 7),
-- Cerrajería Flores (usuario 23) - Cerrajería
(23, 8),
-- Clima Service (usuario 24) - Climatización
(24, 9),
-- Mudanzas Ortega (usuario 25) - Mudanzas
(25, 10),
-- Reparaciones Vargas (usuario 26) - Mecánica
(26, 11),
-- Tapicería Aguirre (usuario 27) - Tapicería
(27, 12),
-- Herrería Medina (usuario 28) - Herrería
(28, 13),
-- Vidriería Navarro (usuario 29) - Vidriería
(29, 14),
-- Cocina Delgado (usuario 30) - Cocina
(30, 15),
-- Clean House (usuario 31) - Limpieza
(31, 1),
-- Plomería Express (usuario 32) - Plomería
(32, 2),
-- Electricidad 24hs (usuario 33) - Electricidad
(33, 3),
-- Verde Total (usuario 34) - Jardinería
(34, 4),
-- Pintura Profesional (usuario 35) - Pintura
(35, 5),
-- Plomería Rápida (usuario 36) - Plomeria
(36, 2),
-- Plomería Central (usuario 37- Plomeria)
(37, 2),
-- Plomería Express 24hs (usuario 38- Plomeria)
(38, 2),
-- Plomería del Norte (usuario 39- Plomeria)
(39, 2),
-- Plomería Sur (usuario 40- Plomeria)
(40, 2),
-- Plomería Total (usuario 41- Plomeria)
(41, 2),
-- Plomería y Gas (usuario 42- Plomeria)
(42, 2),
-- Plomería Económica (usuario 43- Plomeria)
(43, 2),
-- Plomería Profesional (usuario 44- Plomeria)
(44, 2),
-- Plomería Rosario (usuario 45- Plomeria)
(45, 2),
-- Plomería Familiar (usuario 46- Plomeria)
(46, 2),
-- Plomería Urbana (usuario 47- Plomeria)
(47, 2),
-- Plomería del Oeste (usuario 48- Plomeria)
(48, 2),
-- Plomería Premium (usuario 49- Plomeria)
(49, 2);


-- 9. Insertar TURNOS
INSERT INTO `turno` (`fecha_hora`, `estado`, `calificacion`, `comentario`, `monto_final`, `fecha_pago`, `servicio_id`, `usuario_id`) VALUES
-- Turnos para María González (usuario 1) - 8 turnos
('2024-07-15 09:00:00', 'confirmado', 5, 'Excelente servicio, muy puntuales', 15000, '2024-07-15', 1, 1),
('2024-07-22 14:30:00', 'completado', 4, 'Buen trabajo, recomendado', 45000, '2024-07-22', 17, 1),
('2024-07-29 11:00:00', 'pendiente', NULL, NULL, 45000, NULL, 33, 1),
('2024-08-05 16:00:00', 'confirmado', NULL, NULL, 15000, NULL, 49, 1),
('2024-08-12 10:30:00', 'cancelado', NULL, NULL, 25000, NULL, 2, 1),
('2024-08-19 13:45:00', 'pendiente', NULL, NULL, 14000, NULL, 65, 1),
('2024-08-26 09:15:00', 'confirmado', NULL, NULL, 11000, NULL, 73, 1),
('2024-09-02 15:30:00', 'pendiente', NULL, NULL, 12000, NULL, 9, 1),

-- Turnos para Carlos Rodríguez (usuario 2) - 7 turnos
('2024-07-16 08:30:00', 'completado', 5, 'Perfecto, resolvió el problema rápidamente', 8000, '2024-07-16', 5, 2),
('2024-07-23 15:00:00', 'confirmado', NULL, NULL, 80000, NULL, 21, 2),
('2024-07-30 12:30:00', 'pendiente', NULL, NULL, 25000, NULL, 37, 2),
('2024-08-06 17:00:00', 'confirmado', NULL, NULL, 8000, NULL, 53, 2),
('2024-08-13 11:30:00', 'pendiente', NULL, NULL, 11000, NULL, 69, 2),
('2024-08-20 14:00:00', 'cancelado', NULL, NULL, 20000, NULL, 13, 2),
('2024-08-27 16:30:00', 'pendiente', NULL, NULL, 55000, NULL, 25, 2),

-- Turnos para Ana Martínez (usuario 3) - 7 turnos  
('2024-07-17 10:00:00', 'completado', 4, 'Muy profesional, llegó a horario', 12000, '2024-07-17', 9, 3),
('2024-07-24 13:30:00', 'confirmado', NULL, NULL, 18000, NULL, 41, 3),
('2024-07-31 09:30:00', 'pendiente', NULL, NULL, 40000, NULL, 57, 3),
('2024-08-07 16:30:00', 'confirmado', NULL, NULL, 8000, NULL, 14, 3),
('2024-08-14 12:00:00', 'pendiente', NULL, NULL, 20000, NULL, 26, 3),
('2024-08-21 15:30:00', 'confirmado', NULL, NULL, 22000, NULL, 42, 3),
('2024-08-28 10:30:00', 'pendiente', NULL, NULL, 12000, NULL, 58, 3),

-- Turnos para Luis Fernández (usuario 4) - 6 turnos
('2024-07-18 14:00:00', 'confirmado', NULL, NULL, 60000, NULL, 18, 4),
('2024-07-25 11:30:00', 'pendiente', NULL, NULL, 8000, NULL, 34, 4),
('2024-08-01 16:00:00', 'confirmado', NULL, NULL, 60000, NULL, 50, 4),
('2024-08-08 09:30:00', 'pendiente', NULL, NULL, 24000, NULL, 66, 4),
('2024-08-15 13:00:00', 'confirmado', NULL, NULL, 6000, NULL, 10, 4),
('2024-08-22 15:00:00', 'pendiente', NULL, NULL, 15000, NULL, 22, 4),

-- Turnos para Sofía López (usuario 5) - 6 turnos
('2024-07-19 09:30:00', 'pendiente', NULL, NULL, 35000, NULL, 3, 5),
('2024-07-26 14:30:00', 'confirmado', NULL, NULL, 25000, NULL, 19, 5),
('2024-08-02 11:00:00', 'pendiente', NULL, NULL, 25000, NULL, 35, 5),
('2024-08-09 16:30:00', 'confirmado', NULL, NULL, 25000, NULL, 51, 5),
('2024-08-16 10:00:00', 'pendiente', NULL, NULL, 24000, NULL, 67, 5),
('2024-08-23 13:30:00', 'confirmado', NULL, NULL, 15000, NULL, 11, 5),

-- Turnos para Diego Santos (usuario 6) - 6 turnos
('2024-07-20 15:30:00', 'confirmado', NULL, NULL, 40000, NULL, 27, 6),
('2024-07-27 10:30:00', 'pendiente', NULL, NULL, 12000, NULL, 43, 6),
('2024-08-03 14:00:00', 'confirmado', NULL, NULL, 15000, NULL, 59, 6),
('2024-08-10 12:30:00', 'pendiente', NULL, NULL, 12000, NULL, 15, 6),
('2024-08-17 16:00:00', 'confirmado', NULL, NULL, 35000, NULL, 31, 6),
('2024-08-24 11:30:00', 'pendiente', NULL, NULL, 18000, NULL, 47, 6),

-- Turnos para Patricia Silva (usuario 7) - 6 turnos
('2024-07-21 12:00:00', 'pendiente', NULL, NULL, 10000, NULL, 12, 7),
('2024-07-28 15:30:00', 'confirmado', NULL, NULL, 30000, NULL, 28, 7),
('2024-08-04 10:00:00', 'pendiente', NULL, NULL, 20000, NULL, 44, 7),
('2024-08-11 14:30:00', 'confirmado', NULL, NULL, 20000, NULL, 60, 7),
('2024-08-18 09:00:00', 'pendiente', NULL, NULL, 30000, NULL, 16, 7),
('2024-08-25 13:00:00', 'confirmado', NULL, NULL, 3000, NULL, 32, 7),

-- Turnos para Roberto Pérez (usuario 8) - 6 turnos
('2024-07-23 11:00:00', 'confirmado', NULL, NULL, 35000, NULL, 20, 8),
('2024-07-30 16:00:00', 'pendiente', NULL, NULL, 6000, NULL, 36, 8),
('2024-08-06 13:30:00', 'confirmado', NULL, NULL, 30000, NULL, 52, 8),
('2024-08-13 10:30:00', 'pendiente', NULL, NULL, 43000, NULL, 68, 8),
('2024-08-20 15:00:00', 'confirmado', NULL, NULL, 50000, NULL, 24, 8),
('2024-08-27 12:00:00', 'pendiente', NULL, NULL, 12000, NULL, 4, 8);

-- Script completado exitosamente
SELECT 'Base de datos HomeService poblada exitosamente con estructura corregida' AS mensaje;
