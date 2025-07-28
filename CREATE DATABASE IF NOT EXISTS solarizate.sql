CREATE DATABASE IF NOT EXISTS solarizate
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;
USE solarizate;


DROP TABLE IF EXISTS instalacion;
DROP TABLE IF EXISTS electrodomestico;
DROP TABLE IF EXISTS electrodomestico_hogar;
DROP TABLE IF EXISTS hogar;
DROP TABLE IF EXISTS panel_solar;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS rol;




CREATE TABLE rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo enum('admin', 'usuario') NOT NULL
)engine=InnoDB; 


CREATE TABLE usuario (
   id INT AUTO_INCREMENT PRIMARY KEY,
   nombre VARCHAR(50) NOT NULL,
   documento VARCHAR(20) NOT NULL,
   correo VARCHAR(100) NOT NULL,
   contraseña VARCHAR(30) NOT NULL,
   fk_roll INT NOT NULL,
   FOREIGN KEY (fk_roll) REFERENCES rol(id)
)engine=InnoDB;

CREATE TABLE region (
   id INT AUTO_INCREMENT PRIMARY KEY,
   nombre VARCHAR(50) NOT NULL
   )engine=InnoDB;

CREATE TABLE hogar (
   id INT AUTO_INCREMENT PRIMARY KEY,
   direccion VARCHAR(100) NOT NULL,
   ciudad VARCHAR(50) NOT NULL,
   consumo_estimado DECIMAL(10, 2) NOT NULL,
   generacion_estimada DECIMAL(10, 2) NOT NULL,
   fk_usuario INT NOT NULL,
   fk_region INT NOT NULL,
   FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
   FOREIGN KEY (fk_region) REFERENCES region(id)
)engine=InnoDB;


CREATE TABLE electrodomestico (
   id INT AUTO_INCREMENT PRIMARY KEY,
   nombre VARCHAR(50) NOT NULL,
   tipo VARCHAR(50) NOT NULL,
   consumo DECIMAL(10, 2) NOT NULL
)engine=InnoDB;

CREATE TABLE electrodomestico_hogar (
   id INT AUTO_INCREMENT PRIMARY KEY,
   fk_electrodomestico INT NOT NULL,
   fk_hogar INT NOT NULL,
   FOREIGN KEY (fk_electrodomestico) REFERENCES electrodomestico(id),
   FOREIGN KEY (fk_hogar) REFERENCES hogar(id) on DELETE CASCADE
)engine=InnoDB;


CREATE TABLE panel_solar (
   id INT AUTO_INCREMENT PRIMARY KEY,
   poterncia DECIMAL(10, 2) NOT NULL,
   tipo VARCHAR(50) NOT NULL, -- Tipo de panel solar por ejemplo: monocristalino, policristalino, 
   energia_generada DECIMAL(10, 2) NOT NULL
)engine=InnoDB;



CREATE  TABLE instalacion (
   id INT AUTO_INCREMENT PRIMARY KEY,
   cantidad_panel INT NOT NULL,
   generacion_estimada DECIMAL(10, 2) NOT NULL,
   fk_panel_solar INT NOT NULL,
   fk_hogar INT NOT NULL,
   FOREIGN KEY (fk_panel_solar) REFERENCES panel_solar(id),
   FOREIGN KEY (fk_hogar) REFERENCES hogar(id) ON DELETE CASCADE;
)engine=InnoDB;



insert into rol (tipo) values
('admin'), 
('usuario');



insert into usuario (nombre, documento, correo, CONTRASENA, fk_roll) values
('diego', '123', 'pepito@gmail.com', '1234', 1),
('juan', '456', 'lolito@aaa.com', '1234', 1),
('pedro', '789', 'ppppp@ssss.com', '1234', 2),
('luis', '101112', 'aaaa@pppp.com', '1234', 2);

insert into region (nombre) values
('andina'),
('caribe'),
('pacifico'),
('orinoquia'),
('amazonia'),
('insular');

insert into hogar (direccion, ciudad, fk_usuario, fk_region) values
('calle 123', 'bogota', 1, 1),
('calle 456', 'cartagena', 2, 2),
('calle 789', 'medellin', 3, 3),
('calle 101112', 'barranquilla', 4, 4);


insert into electrodomestico (nombre, tipo, consumo, fk_hogar) values
('refrigerador', 'Electrodomésticos de cocina', 150.00, 1),
('microondas', 'Electrodomésticos de cocina', 100.00, 2),
('lavadora', 'Grandes electrodomésticos', 200.00, 3),
('televisor', 'Electrodomésticos de entretenimiento', 120.00, 4);

insert into panel_solar (poterncia, energia_generada) values
(300.00, 500.00),
(400.00, 600.00),
(500.00, 700.00),
(600.00, 800.00);

insert into instalacion (cantidad_pamel, fk_panel_solar, fk_hogar) values
(2, 1, 1),
(3, 2, 2),
(4, 3, 3),
(5, 4, 4);


insert into panel_solar (poterncia, tipo, energia_generada) values
(300.00, 'monocristalino', 500.00),
(400.00, 'policristalino', 600.00);



insert into electrodomestico(nombre, tipo, consumo) values
('aire acondicionado', 'Climatización', 2000.00),
('calentador de agua', 'Calefacción', 1500.00),
('aspiradora', 'Limpieza', 800.00),
('lavavajillas', 'Cocina', 1200.00),
('secadora', 'Limpieza', 900.00),
('estufa eléctrica', 'Cocina', 1800.00),
('ventilador', 'Climatización', 100.00),
('plancha', 'Cuidado personal', 1200.00),
('televisor inteligente', 'Entretenimiento', 200.00),
('consola de videojuegos', 'Entretenimiento', 300.00),
('computadora portátil', 'Tecnología', 150.00),
('impresora', 'Tecnología', 50.00),
('cafetera', 'Cocina', 800.00),
('batidora', 'Cocina', 500.00),
('licuadora', 'Cocina', 400.00),
('tostadora', 'Cocina', 300.00),
('reproductor de DVD', 'Entretenimiento', 100.00),
('altavoces Bluetooth', 'Tecnología', 200.00),
('router Wi-Fi', 'Tecnología', 50.00),
('cámara de seguridad', 'Seguridad', 150.00),
('termómetro inteligente', 'Cuidado personal', 50.00),
('humidificador', 'Climatización', 100.00),
('deshumidificador', 'Climatización', 150.00),
('aspiradora robot', 'Limpieza', 300.00),
('calefactor eléctrico', 'Calefacción', 800.00),
('reproductor de música', 'Entretenimiento', 100.00),
('proyector de video', 'Entretenimiento', 500.00),
('sistema de sonido', 'Entretenimiento', 600.00),
('refrigerador inteligente', 'Electrodomésticos de cocina', 1500.00),
('horno eléctrico', 'Cocina', 1200.00),
('microondas inteligente', 'Cocina', 800.00),
('lavadora inteligente', 'Grandes electrodomésticos', 1000.00),
('secadora inteligente', 'Limpieza', 900.00),
('calentador de aire portátil', 'Climatización', 700.00),
('humidificador portátil', 'Climatización', 200.00),
('deshumidificador portátil', 'Climatización', 250.00),
('aspiradora de mano', 'Limpieza', 150.00),
('plancha de vapor', 'Cuidado personal', 100.00),
('cepillo de dientes eléctrico', 'Cuidado personal', 50.00),
('máquina de afeitar eléctrica', 'Cuidado personal', 80.00),
('secador de pelo', 'Cuidado personal', 60.00),
('batidora de mano', 'Cocina', 70.00),
('licuadora de alta potencia', 'Cocina', 200.00),
('tostadora inteligente', 'Cocina', 120.00),
('cafetera espresso', 'Cocina', 300.00),
('freidora de aire', 'Cocina', 250.00),
('olla de cocción lenta', 'Cocina', 150.00),
('olla a presión eléctrica', 'Cocina', 200.00),
('robot de cocina', 'Cocina', 400.00),
('batidora de pie', 'Cocina', 300.00),
('licuadora de inmersión', 'Cocina', 100.00),
('cocina de inducción portátil', 'Cocina', 150.00),
('horno tostador', 'Cocina', 80.00),
('freidora eléctrica', 'Cocina', 100.00),
('plancha vertical', 'Cuidado personal', 90.00),
('aspiradora sin cable', 'Limpieza', 200.00),
('robot aspirador', 'Limpieza', 300.00),
('lavavajillas inteligente', 'Grandes electrodomésticos', 800.00),
('secadora de ropa inteligente', 'Limpieza', 700.00),
('calentador de agua eléctrico', 'Calefacción', 600.00),
('calefactor de espacio eléctrico', 'Calefacción', 400.00),
('humidificador de aire', 'Climatización', 100.00),
('deshumidificador de aire', 'Climatización', 150.00),
('ventilador de torre', 'Climatización', 80.00),
('ventilador de techo', 'Climatización', 120.00),
('aire acondicionado portátil', 'Climatización', 500.00),
('aire acondicionado de ventana', 'Climatización', 600.00),
('calentador de ambiente eléctrico', 'Calefacción', 300.00),
('calefactor de baño eléctrico', 'Calefacción', 200.00),
('aspiradora de robot', 'Limpieza', 250.00),
('aspiradora de trineo', 'Limpieza', 150.00),
('lavadora de carga frontal', 'Grandes electrodomésticos', 700.00),
('lavadora de carga superior', 'Grandes electrodomésticos', 600.00),
('secadora de carga frontal', 'Limpieza', 500.00),
('secadora de carga superior', 'Limpieza', 400.00),
('calentador de agua a gas', 'Calefacción', 300.00),
('calentador de agua solar', 'Calefacción', 400.00),
('calentador de agua eléctrico', 'Calefacción', 500.00),
('calefactor de espacio a gas', 'Calefacción', 250.00),
('calefactor de espacio a propano', 'Calefacción', 200.00),
('humidificador ultrasónico', 'Climatización', 80.00),
('humidificador evaporativo', 'Climatización', 100.00),
('deshumidificador de condensación', 'Climatización', 120.00),
('ventilador de pedestal', 'Climatización', 60.00),
('ventilador de mesa', 'Climatización', 50.00),
('aire acondicionado de pared', 'Climatización', 700.00),
('aire acondicionado central', 'Climatización', 1500.00),
('calentador de ambiente a gas', 'Calefacción', 350.00),
('calentador de ambiente a propano', 'Calefacción', 300.00),
('aspiradora de mano sin cable', 'Limpieza', 100.00),
('aspiradora de trineo sin bolsa', 'Limpieza', 120.00),
('lavadora de carga frontal inteligente', 'Grandes electrodomésticos', 800.00),
('lavadora de carga superior inteligente', 'Grandes electrodomésticos', 700.00),
('secadora de carga frontal inteligente', 'Limpieza', 600.00),
('secadora de carga superior inteligente', 'Limpieza', 500.00),
('calentador de agua a gas instantáneo', 'Calefacción', 400.00),
('calentador de agua solar térmico', 'Calefacción', 600.00),
('calentador de agua eléctrico instantáneo', 'Calefacción', 500.00),
('calefactor de espacio eléctrico portátil', 'Calefacción', 200.00),
('calefactor de espacio a gas portátil', 'Calefacción', 150.00),
('humidificador ultrasónico portátil', 'Climatización', 50.00),
('humidificador evaporativo portátil', 'Climatización', 60.00),
('deshumidificador de condensación portátil', 'Climatización', 80.00),
('ventilador de pedestal portátil', 'Climatización', 40.00),
('ventilador de mesa portátil', 'Climatización', 30.00),
('aire acondicionado portátil inteligente', 'Climatización', 800.00),
('aire acondicionado de ventana inteligente', 'Climatización', 900.00),
('calentador de ambiente eléctrico inteligente', 'Calefacción', 400.00),
('calefactor de baño eléctrico inteligente', 'Calefacción', 300.00),
('aspiradora de robot inteligente', 'Limpieza', 350.00),
('aspiradora de trineo sin bolsa inteligente', 'Limpieza', 200.00),
('lavavajillas inteligente de carga frontal', 'Grandes electrodomésticos', 900.00),
('lavavajillas inteligente de carga superior', 'Grandes electrodomésticos', 800.00),
('secadora de ropa inteligente de carga frontal', 'Limpieza', 700.00),
('secadora de ropa inteligente de carga superior', 'Limpieza', 600.00),
('calentador de agua a gas instantáneo inteligente', 'Calefacción', 500.00),
('calentador de agua solar térmico inteligente', 'Calefacción', 700.00),
('calentador de agua eléctrico instantáneo inteligente', 'Calefacción', 600.00),
('calefactor de espacio eléctrico portátil inteligente', 'Calefacción', 250.00),
('calefactor de espacio a gas portátil inteligente', 'Calefacción', 200.00),
('humidificador ultrasónico portátil inteligente', 'Climatización', 70.00),
('humidificador evaporativo portátil inteligente', 'Climatización', 80.00),
('deshumidificador de condensación portátil inteligente', 'Climatización', 100.00),
('ventilador de pedestal portátil inteligente', 'Climatización', 50.00),
('ventilador de mesa portátil inteligente', 'Climatización', 40.00),
('aire acondicionado portátil inteligente de alta eficiencia', 'Climatización', 900.00),
('aire acondicionado de ventana inteligente de alta eficiencia', 'Climatización', 1000.00),
('calentador de ambiente eléctrico inteligente de alta eficiencia', 'Calefacción', 500.00),
('calefactor de baño eléctrico inteligente de alta eficiencia', 'Calefacción', 400.00),
('aspiradora de robot inteligente de alta eficiencia', 'Limpieza', 400.00),
('aspiradora de trineo sin bolsa inteligente de alta eficiencia', 'Limpieza', 250.00),
('lavavajillas inteligente de carga frontal de alta eficiencia', 'Grandes electrodomésticos', 1000.00),
('lavavajillas inteligente de carga superior de alta eficiencia', 'Grandes electrodomésticos', 900.00),
('secadora de ropa inteligente de carga frontal de alta eficiencia', 'Limpieza', 800.00),
('secadora de ropa inteligente de carga superior de alta eficiencia', 'Limpieza', 700.00);
