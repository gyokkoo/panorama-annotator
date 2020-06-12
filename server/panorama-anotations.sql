-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 12, 2020 at 07:04 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `panorama-anotations`
--

-- --------------------------------------------------------

--
-- Table structure for table `anotations-table`
--

CREATE TABLE `anotations-table` (
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `tooltip` varchar(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `anotations-table`
--

INSERT INTO `anotations-table` (`latitude`, `longitude`, `tooltip`) VALUES
(-0.20850374218236, 0.42060290492939, 'I was here'),
(-0.12728187819504, 0.55750237486562, 'I was here'),
(-0.074742352349845, 0.03758439727677, 'I was here'),
(-0.25520820072011, 0.45011561848277, 'I was here'),
(0.19694276067466, 5.4713471507678, 'I was here'),
(0.32235566797703, 0.17776410996069, 'I was here');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
