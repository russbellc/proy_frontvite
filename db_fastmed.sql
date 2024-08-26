-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 25-07-2024 a las 08:42:18
-- Versión del servidor: 9.0.1
-- Versión de PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_fastmed`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colegiados`
--

CREATE TABLE `colegiados` (
  `col_id` int NOT NULL,
  `col_persona` int DEFAULT NULL,
  `col_nro_cop` varchar(10) DEFAULT NULL,
  `col_fecha_colegiatura` varchar(45) DEFAULT NULL,
  `col_centro_trabajo` varchar(45) DEFAULT NULL,
  `col_st` varchar(45) DEFAULT NULL,
  `col_obs` varchar(45) DEFAULT NULL,
  `col_foto` varchar(200) DEFAULT NULL,
  `col_fech_create` varchar(45) DEFAULT NULL,
  `col_fech_update` varchar(45) DEFAULT NULL,
  `col_usu_create` varchar(45) DEFAULT NULL,
  `col_usu_update` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `per_id` int NOT NULL,
  `per_tdoc` int DEFAULT NULL,
  `per_nro_doc` varchar(25) DEFAULT NULL,
  `per_nombre` varchar(100) DEFAULT NULL,
  `per_appat` varchar(100) DEFAULT NULL,
  `per_apmat` varchar(100) DEFAULT NULL,
  `per_sexo` char(1) DEFAULT NULL,
  `per_correo` varchar(100) DEFAULT NULL,
  `per_nacionalidad` varchar(10) DEFAULT NULL,
  `per_direccion1` varchar(150) DEFAULT NULL,
  `per_direccion2` varchar(45) DEFAULT NULL,
  `per_lugar_nac` varchar(6) DEFAULT NULL,
  `per_fech_nac` date DEFAULT NULL,
  `per_st` char(1) DEFAULT NULL,
  `per_telf` varchar(45) DEFAULT NULL,
  `per_celular1` varchar(15) DEFAULT NULL,
  `per_celular2` varchar(15) DEFAULT NULL,
  `per_fech_create` datetime DEFAULT NULL,
  `per_fech_update` datetime DEFAULT NULL,
  `per_usu_create` varchar(45) DEFAULT NULL,
  `per_usu_update` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`per_id`, `per_tdoc`, `per_nro_doc`, `per_nombre`, `per_appat`, `per_apmat`, `per_sexo`, `per_correo`, `per_nacionalidad`, `per_direccion1`, `per_direccion2`, `per_lugar_nac`, `per_fech_nac`, `per_st`, `per_telf`, `per_celular1`, `per_celular2`, `per_fech_create`, `per_fech_update`, `per_usu_create`, `per_usu_update`) VALUES
(1, 1, '48357829', 'MIKAIL RUSSBELL', 'CASTRO', 'JARA', 'M', 'russbellc@gmail.com', 'PERUANO', 'AV. DE LA CULTURA 1412', NULL, '070101', '1991-11-13', '1', NULL, '965041491', NULL, '2024-07-25 03:04:16', NULL, 'admin', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sys_control`
--

CREATE TABLE `sys_control` (
  `cont_sede` int NOT NULL,
  `cont_usuario` varchar(45) NOT NULL,
  `cont_perfil` int NOT NULL,
  `cont_st` tinyint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `sys_control`
--

INSERT INTO `sys_control` (`cont_sede`, `cont_usuario`, `cont_perfil`, `cont_st`) VALUES
(1, 'NlNphzL1tU9yuXdjCb9JV24h4', 1, 1),
(2, 'NlNphzL1tU9yuXdjCb9JV24h4', 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sys_dperfil`
--

CREATE TABLE `sys_dperfil` (
  `dperf_menu` int NOT NULL,
  `dperf_perfil` int NOT NULL,
  `dperf_permisos` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `sys_dperfil`
--

INSERT INTO `sys_dperfil` (`dperf_menu`, `dperf_perfil`, `dperf_permisos`) VALUES
(1, 1, '1'),
(2, 1, '1'),
(3, 1, '1'),
(4, 1, '1'),
(5, 1, '1'),
(6, 1, '1'),
(7, 1, '1'),
(8, 1, '1'),
(9, 1, '1'),
(2, 2, '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sys_empresa`
--

CREATE TABLE `sys_empresa` (
  `emp_id` int NOT NULL,
  `emp_ruc` varchar(11) DEFAULT NULL,
  `emp_rznsocial` varchar(200) DEFAULT NULL,
  `emp_acro` varchar(200) DEFAULT NULL,
  `emp_direccion` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `sys_empresa`
--

INSERT INTO `sys_empresa` (`emp_id`, `emp_ruc`, `emp_rznsocial`, `emp_acro`, `emp_direccion`) VALUES
(1, '10483578291', 'LIVE CODE S.A.C.', 'LIVE CODE S.A.C.', 'AV. DE LA CULTURA 1412'),
(2, '10876543211', 'FastMed', 'FastMed', '-');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sys_menu`
--

CREATE TABLE `sys_menu` (
  `menu_id` int NOT NULL,
  `menu_desc` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `sys_menu`
--

INSERT INTO `sys_menu` (`menu_id`, `menu_desc`) VALUES
(1, 'Administrativo'),
(2, 'Medicina'),
(3, 'Configuracion'),
(4, 'Pagos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sys_perfil`
--

CREATE TABLE `sys_perfil` (
  `perf_id` int NOT NULL,
  `perf_desc` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `sys_perfil`
--

INSERT INTO `sys_perfil` (`perf_id`, `perf_desc`) VALUES
(1, 'Súper Admin'),
(2, 'Administrador'),
(3, 'Personal'),
(4, 'Asistente'),
(5, 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sys_sede`
--

CREATE TABLE `sys_sede` (
  `sede_id` int NOT NULL,
  `sede_empresa` int NOT NULL,
  `sede_nombre` varchar(100) NOT NULL,
  `sede_direccion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `sys_sede`
--

INSERT INTO `sys_sede` (`sede_id`, `sede_empresa`, `sede_nombre`, `sede_direccion`) VALUES
(1, 1, 'SEDE PRINCIPAL', '-'),
(2, 2, 'FastMed Principal', '-');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sys_submenu`
--

CREATE TABLE `sys_submenu` (
  `submenu_id` int NOT NULL,
  `submenu_padre` int NOT NULL,
  `submenu_titulo` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `submenu_icon` varchar(45) DEFAULT NULL,
  `submenu_href` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `sys_submenu`
--

INSERT INTO `sys_submenu` (`submenu_id`, `submenu_padre`, `submenu_titulo`, `submenu_icon`, `submenu_href`) VALUES
(1, 1, 'Admisión', 'admin', 'admision'),
(2, 1, 'Colegiado', 'persona', 'colegiado'),
(3, 1, 'Persona', 'persona', 'persona'),
(4, 3, 'Usuario', 'user', 'usuario'),
(5, 3, 'Perfil', 'profile', 'perfil'),
(6, 3, 'Menu', 'menu', 'menu'),
(7, 3, 'Empresa', 'empresa', 'empresa'),
(8, 3, 'Sede', 'sede', 'sede'),
(9, 3, 'Periodos', 'periodo', 'periodos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sys_usuario`
--

CREATE TABLE `sys_usuario` (
  `usu_id` varchar(45) NOT NULL,
  `usu_correo` varchar(90) NOT NULL,
  `usu_password` varchar(45) NOT NULL,
  `usu_nombre` varchar(45) NOT NULL,
  `usu_persona` int DEFAULT NULL,
  `usu_st` varchar(45) NOT NULL,
  `usu_fech_create` datetime DEFAULT NULL,
  `usu_fech_update` datetime DEFAULT NULL,
  `usu_create` varchar(45) DEFAULT NULL,
  `usu_update` varchar(45) DEFAULT NULL,
  `usu_token` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `sys_usuario`
--

INSERT INTO `sys_usuario` (`usu_id`, `usu_correo`, `usu_password`, `usu_nombre`, `usu_persona`, `usu_st`, `usu_fech_create`, `usu_fech_update`, `usu_create`, `usu_update`, `usu_token`) VALUES
('NlNphzL1tU9yuXdjCb9JV24h4', 'russbellc@gmail.com', 'russbellc@gmail.com', 'MIKAIL RUSSBELL CASTRO JARA', 1, '1', '2024-07-25 03:32:52', NULL, 'admin', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_documento`
--

CREATE TABLE `tipo_documento` (
  `tdoc_id` int NOT NULL,
  `tdoc_desc` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `tipo_documento`
--

INSERT INTO `tipo_documento` (`tdoc_id`, `tdoc_desc`) VALUES
(1, 'DNI'),
(2, 'CARNET DE EXTRANGERIA');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `colegiados`
--
ALTER TABLE `colegiados`
  ADD PRIMARY KEY (`col_id`),
  ADD KEY `fk_col_persona_idx` (`col_persona`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`per_id`),
  ADD UNIQUE KEY `usu_nro_doc_UNIQUE` (`per_nro_doc`),
  ADD KEY `fk_usu_tdoc_idx` (`per_tdoc`);

--
-- Indices de la tabla `sys_control`
--
ALTER TABLE `sys_control`
  ADD KEY `fk_cont_sede_idx` (`cont_sede`),
  ADD KEY `fk_cont_perfil_idx` (`cont_perfil`),
  ADD KEY `fk_cont_usuario_idx` (`cont_usuario`);

--
-- Indices de la tabla `sys_dperfil`
--
ALTER TABLE `sys_dperfil`
  ADD KEY `fk_dperf_menu_idx` (`dperf_menu`),
  ADD KEY `fk_dperf_perfil_idx` (`dperf_perfil`);

--
-- Indices de la tabla `sys_empresa`
--
ALTER TABLE `sys_empresa`
  ADD PRIMARY KEY (`emp_id`);

--
-- Indices de la tabla `sys_menu`
--
ALTER TABLE `sys_menu`
  ADD PRIMARY KEY (`menu_id`);

--
-- Indices de la tabla `sys_perfil`
--
ALTER TABLE `sys_perfil`
  ADD PRIMARY KEY (`perf_id`);

--
-- Indices de la tabla `sys_sede`
--
ALTER TABLE `sys_sede`
  ADD PRIMARY KEY (`sede_id`),
  ADD KEY `fk_sede_empresa_idx` (`sede_empresa`);

--
-- Indices de la tabla `sys_submenu`
--
ALTER TABLE `sys_submenu`
  ADD PRIMARY KEY (`submenu_id`),
  ADD UNIQUE KEY `menu_id_UNIQUE` (`submenu_id`),
  ADD KEY `fk_submenu_padre_idx` (`submenu_padre`);

--
-- Indices de la tabla `sys_usuario`
--
ALTER TABLE `sys_usuario`
  ADD PRIMARY KEY (`usu_id`),
  ADD UNIQUE KEY `usu_correo_UNIQUE` (`usu_correo`),
  ADD KEY `fk_usu_persona_idx` (`usu_persona`);

--
-- Indices de la tabla `tipo_documento`
--
ALTER TABLE `tipo_documento`
  ADD PRIMARY KEY (`tdoc_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `colegiados`
--
ALTER TABLE `colegiados`
  MODIFY `col_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `per_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `sys_empresa`
--
ALTER TABLE `sys_empresa`
  MODIFY `emp_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `sys_menu`
--
ALTER TABLE `sys_menu`
  MODIFY `menu_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `sys_perfil`
--
ALTER TABLE `sys_perfil`
  MODIFY `perf_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `sys_sede`
--
ALTER TABLE `sys_sede`
  MODIFY `sede_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `sys_submenu`
--
ALTER TABLE `sys_submenu`
  MODIFY `submenu_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `tipo_documento`
--
ALTER TABLE `tipo_documento`
  MODIFY `tdoc_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `colegiados`
--
ALTER TABLE `colegiados`
  ADD CONSTRAINT `fk_col_persona` FOREIGN KEY (`col_persona`) REFERENCES `persona` (`per_id`);

--
-- Filtros para la tabla `persona`
--
ALTER TABLE `persona`
  ADD CONSTRAINT `fk_usu_tdoc` FOREIGN KEY (`per_tdoc`) REFERENCES `tipo_documento` (`tdoc_id`);

--
-- Filtros para la tabla `sys_control`
--
ALTER TABLE `sys_control`
  ADD CONSTRAINT `fk_cont_perfil` FOREIGN KEY (`cont_perfil`) REFERENCES `sys_perfil` (`perf_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cont_sede` FOREIGN KEY (`cont_sede`) REFERENCES `sys_sede` (`sede_id`),
  ADD CONSTRAINT `fk_cont_usuario` FOREIGN KEY (`cont_usuario`) REFERENCES `sys_usuario` (`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `sys_dperfil`
--
ALTER TABLE `sys_dperfil`
  ADD CONSTRAINT `fk_dperf_menu` FOREIGN KEY (`dperf_menu`) REFERENCES `sys_submenu` (`submenu_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dperf_perfil` FOREIGN KEY (`dperf_perfil`) REFERENCES `sys_perfil` (`perf_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `sys_sede`
--
ALTER TABLE `sys_sede`
  ADD CONSTRAINT `fk_sede_empresa` FOREIGN KEY (`sede_empresa`) REFERENCES `sys_empresa` (`emp_id`);

--
-- Filtros para la tabla `sys_submenu`
--
ALTER TABLE `sys_submenu`
  ADD CONSTRAINT `fk_submenu_padre` FOREIGN KEY (`submenu_padre`) REFERENCES `sys_menu` (`menu_id`);

--
-- Filtros para la tabla `sys_usuario`
--
ALTER TABLE `sys_usuario`
  ADD CONSTRAINT `fk_usu_persona` FOREIGN KEY (`usu_persona`) REFERENCES `persona` (`per_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
