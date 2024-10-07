-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 08, 2024 at 01:20 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `healthhub`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `id` int(11) NOT NULL,
  `date` datetime(3) NOT NULL,
  `userId` int(11) NOT NULL,
  `facilityId` int(11) DEFAULT NULL,
  `teleconsultationId` int(11) DEFAULT NULL,
  `status` varchar(191) NOT NULL,
  `prescriptionId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `feedbackId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`id`, `date`, `userId`, `facilityId`, `teleconsultationId`, `status`, `prescriptionId`, `createdAt`, `updatedAt`, `feedbackId`) VALUES
(1, '2024-10-11 10:30:00.000', 2, NULL, 1, 'Pending', NULL, '2024-10-07 10:36:15.409', '2024-10-07 10:36:15.409', NULL),
(2, '2024-10-18 10:39:00.000', 2, NULL, 2, 'Pending', NULL, '2024-10-07 10:39:50.426', '2024-10-07 10:39:50.426', NULL),
(3, '2024-10-18 10:39:00.000', 2, NULL, 3, 'Pending', NULL, '2024-10-07 10:40:16.197', '2024-10-07 10:40:16.197', NULL),
(4, '2024-10-09 12:32:00.000', 2, NULL, 4, 'Pending', NULL, '2024-10-07 12:33:00.493', '2024-10-07 12:33:00.493', NULL),
(5, '2024-10-11 12:43:00.000', 2, NULL, 5, 'Pending', NULL, '2024-10-07 12:43:17.198', '2024-10-07 12:43:17.198', NULL),
(6, '2024-10-08 08:02:00.000', 2, NULL, 6, 'Pending', NULL, '2024-10-07 16:03:16.074', '2024-10-07 16:03:16.074', NULL),
(7, '2024-10-08 08:42:00.000', 1, NULL, 7, 'Pending', NULL, '2024-10-07 16:42:18.103', '2024-10-07 16:42:18.103', NULL),
(8, '2024-10-08 08:18:00.000', 2, NULL, 8, 'Pending', NULL, '2024-10-07 17:18:41.672', '2024-10-07 17:18:41.672', NULL),
(9, '2024-10-07 08:29:00.000', 2, NULL, 9, 'Pending', NULL, '2024-10-07 17:30:03.983', '2024-10-07 17:30:03.983', NULL),
(10, '2024-10-08 08:03:00.000', 2, NULL, 10, 'Pending', NULL, '2024-10-07 22:03:32.995', '2024-10-07 22:03:32.995', NULL),
(11, '2024-10-08 08:37:00.000', 2, NULL, 11, 'Pending', NULL, '2024-10-07 22:37:59.426', '2024-10-07 22:37:59.426', NULL),
(12, '2024-10-08 07:41:00.000', 2, NULL, 12, 'Pending', NULL, '2024-10-07 22:42:07.961', '2024-10-07 22:42:07.961', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `availability`
--

CREATE TABLE `availability` (
  `id` int(11) NOT NULL,
  `teleconsultorId` int(11) NOT NULL,
  `dayOfWeek` varchar(191) NOT NULL,
  `startTime` varchar(191) NOT NULL,
  `endTime` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `availability`
--

INSERT INTO `availability` (`id`, `teleconsultorId`, `dayOfWeek`, `startTime`, `endTime`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Monday', '09:00', '12:00', '2024-10-07 17:54:28.000', '2024-10-07 14:54:48.189'),
(2, 1, 'Tuesday', '09:00', '12:00', '2024-10-07 17:55:07.000', '2024-10-07 17:55:07.000'),
(3, 1, 'Wednesday', '09:00', '12:00', '2024-10-07 17:56:11.000', '2024-10-07 17:56:11.000'),
(4, 1, 'Thursday', '09:00', '17:57', '2024-10-07 14:58:01.221', '2024-10-07 14:58:01.221');

-- --------------------------------------------------------

--
-- Table structure for table `chatsession`
--

CREATE TABLE `chatsession` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `sessionName` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chatsession`
--

INSERT INTO `chatsession` (`id`, `userId`, `sessionName`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Session on 10/8/2024, 1:14:55 AM', '2024-10-07 22:14:55.673', '2024-10-07 22:14:55.673'),
(2, 2, 'Session on 10/8/2024, 1:38:51 AM', '2024-10-07 22:38:51.197', '2024-10-07 22:38:51.197');

-- --------------------------------------------------------

--
-- Table structure for table `diagnosis`
--

CREATE TABLE `diagnosis` (
  `id` int(11) NOT NULL,
  `chatSessionId` int(11) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `diagnosisText` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `diagnosis`
--

INSERT INTO `diagnosis` (`id`, `chatSessionId`, `userId`, `diagnosisText`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, '<p>I understand you\'re feeling sick and tired. I can\'t offer medical advice, but I can help you in a few ways:</p>\n<p><strong>1.  What\'s making you feel sick and tired?</strong>\n* Is it a spe', '2024-10-07 22:14:56.308', '2024-10-07 22:14:56.308'),
(2, 2, 2, '<p>Hello!   How can I help you today?</p>\n', '2024-10-07 22:38:51.274', '2024-10-07 22:38:51.274');

-- --------------------------------------------------------

--
-- Table structure for table `emergencyservice`
--

CREATE TABLE `emergencyservice` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `contact` varchar(191) NOT NULL,
  `location` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `teleconsultationId` int(11) DEFAULT NULL,
  `content` varchar(191) NOT NULL,
  `rating` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `appointmentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `userId`, `teleconsultationId`, `content`, `rating`, `createdAt`, `updatedAt`, `appointmentId`) VALUES
(1, 2, 8, 'nice doctor', 5, '2024-10-07 17:26:04.087', '2024-10-07 17:26:04.087', NULL),
(2, 2, 9, 'I am very happy ', 5, '2024-10-07 17:32:29.587', '2024-10-07 17:32:29.587', NULL),
(3, 2, 10, 'Amazing doctor', 5, '2024-10-07 22:08:52.465', '2024-10-07 22:08:52.465', NULL),
(4, 2, 11, 'Thank you', 5, '2024-10-07 22:41:53.255', '2024-10-07 22:41:53.255', NULL),
(5, 2, 12, 'This is amazing', 1, '2024-10-07 22:43:51.869', '2024-10-07 22:43:51.869', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `healthcarefacility`
--

CREATE TABLE `healthcarefacility` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `location` varchar(191) NOT NULL,
  `services` varchar(191) NOT NULL,
  `hours` varchar(191) NOT NULL,
  `contact` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `appointmentPrice` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `healthcarefacility`
--

INSERT INTO `healthcarefacility` (`id`, `name`, `location`, `services`, `hours`, `contact`, `type`, `createdAt`, `updatedAt`, `appointmentPrice`) VALUES
(1, 'Health Hub Ethiopia', 'Latitude: 11.0579789, Longitude: 39.754941', 'Very many services', '10:12 - 23:13', '+251923084916', 'Clinic', '2024-10-07 19:12:27.669', '2024-10-07 19:26:28.783', 100);

-- --------------------------------------------------------

--
-- Table structure for table `healthtip`
--

CREATE TABLE `healthtip` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `content` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `author` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `helparticle`
--

CREATE TABLE `helparticle` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `content` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `authorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `helparticle`
--

INSERT INTO `helparticle` (`id`, `title`, `content`, `category`, `createdAt`, `updatedAt`, `authorId`) VALUES
(1, 'my new articles', 'I am writing this content to tell you that I am managing everything. its going to be oka', 'Technical', '2024-10-07 21:51:39.878', '2024-10-07 21:51:39.878', 3),
(2, 'HEuy there', 'hre it nocsianfklc ax jaoinfdcd xzoihsnzalkjv', 'General', '2024-10-07 22:47:06.517', '2024-10-07 22:47:06.517', 3);

-- --------------------------------------------------------

--
-- Table structure for table `medicalinformation`
--

CREATE TABLE `medicalinformation` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `content` varchar(191) NOT NULL,
  `keywords` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `author` varchar(191) NOT NULL,
  `url` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medicalinformation`
--

INSERT INTO `medicalinformation` (`id`, `title`, `content`, `keywords`, `category`, `author`, `url`, `createdAt`, `updatedAt`) VALUES
(1, 'Big Solar Storm To Hit Earth, Warns NASA. Will It Affect India? - NDTV', 'American scientists have issued a warning that a big solar storm is going to hit the Earth, and it may affect electronic communications. What will be its impact on India?', 'Unknown author', 'Health', 'Unknown author', 'https://www.ndtv.com/india-news/big-solar-storm-to-hit-earth-warns-nasa-will-it-affect-india-6725016', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(2, 'THESE signs of a heart attack can appear in young , super-fit people weeks before - The Times of India', 'Heart attacks among young individuals, especially aged 18-44, are rising alarmingly, even in those leading seemingly healthy lifestyles. Experts highl', 'TOI Lifestyle Desk', 'Health', 'TOI Lifestyle Desk', 'https://timesofindia.indiatimes.com/life-style/health-fitness/health-news/signs-of-a-heart-attack-that-can-appear-in-young-and-super-fit-people-weeks-before/articleshow/113960661.cms', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(3, 'Swindon dad who lost daughter to meningitis urges vaccination - BBC.com', 'Izzy died when she was 16, and her dad is asking parents to be aware of symptoms.', 'Unknown author', 'Health', 'Unknown author', 'https://www.bbc.com/news/articles/c153781852xo', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(4, 'How effective is the flu shot this year? New report reveals \'disappointing\' data - USA TODAY', 'New data from South America suggests the flu vaccine may not be as effective as experts previously thought.', 'Adrianna Rodriguez', 'Health', 'Adrianna Rodriguez', 'https://www.usatoday.com/story/news/health/2024/10/04/flu-shot-vaccine-effectiveness/75510963007/', '2024-10-07 10:30:31.479', '2024-10-07 10:30:31.479'),
(5, 'New Covid variant symptoms explained as doctor warns it\'s \'wiping people out\' - Irish Star', 'As the UK faces a \"tripledemic\" winter, Dr Helen Wall has shared important information about the new XEC Covid variant, which could soon become the most dominant strain', 'Rudi Kinsella, Samantha Leathers, Helena Vesty', 'Health', 'Rudi Kinsella, Samantha Leathers, Helena Vesty', 'https://www.irishstar.com/news/us-news/covid-variant-symptoms-explained-sickness-33821329', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(6, 'Doctors And Nurses Are Revealing The Medical \"Lies\" People Should Stop Believing - Yahoo Life', '\"When you have an IV site, there isn\'t a needle in your arm. There is a tiny, flexible, plastic catheter, and it\'s not going to tear through your veins and...', 'Liz Richardson', 'Health', 'Liz Richardson', 'https://www.buzzfeed.com/lizmrichardson/medical-lies-health-myths-misconceptions', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(7, '51 Absolutely Fascinating Photos Of The Human Body That My Brain Actually Cannot Process - BuzzFeed', 'Human beings are SO FRICKEN COOL.', 'Hannah Marder', 'Health', 'Hannah Marder', 'https://www.buzzfeed.com/hannahmarder/fascinating-photos-of-the-human-body', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(8, 'Gene Activity in Depression Linked to Immune System and Inflammation - Neuroscience News', 'A new study reveals that inflammation and immune system activation are closely linked to major depressive disorder (MDD), particularly in those resistant to standard antidepressants.', 'Neuroscience News', 'Health', 'Neuroscience News', 'https://neurosciencenews.com/genetics-depression-inflammation-27788/', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(9, 'First Gut Microbiome Map for Personalized Food Responses - Neuroscience News', 'A recent study has mapped how molecules in food interact with gut bacteria, revealing why people respond differently to the same diets.', 'Neuroscience News', 'Health', 'Neuroscience News', 'https://neurosciencenews.com/microbiome-food-map-27791/', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(10, 'How a regular ultrasound to check on her pregnancy revealed a big health issue - CBS News', 'Doctors operated on Allison Misconin\'s reproductive system while she was more than halfway through her first pregnancy.', 'Kerry Breen', 'Health', 'Kerry Breen', 'https://www.cbsnews.com/news/suspicious-mass-found-during-pregnancy-early-detection/', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(11, '[Removed]', '[Removed]', 'Unknown author', 'Health', 'Unknown author', 'https://removed.com', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(12, 'Tiny Siamese Kitten Who Talks in Her Sleep Is the Cutest Little Chatterbox - Yahoo Life', 'We can\'t help but wonder what she\'s saying.', 'Candace Ganger Powell', 'Health', 'Candace Ganger Powell', 'https://paradepets.com/pet-news/siamese-kitten-talks-in-her-sleep', '2024-10-07 10:30:31.479', '2024-10-07 10:30:31.479'),
(13, '[Removed]', '[Removed]', 'Unknown author', 'Health', 'Unknown author', 'https://removed.com', '2024-10-07 10:30:31.479', '2024-10-07 10:30:31.479'),
(14, 'No time to get your steps in? Here\'s how to hit 10,000 steps without leaving the house - Fit and Well', 'Take the equivalent of a five-mile walk in just 40 minutes', 'Maddy Biddulph', 'Health', 'Maddy Biddulph', 'https://www.fitandwell.com/features/no-time-to-get-your-steps-in-heres-how-to-hit-10-000-steps-without-leaving-the-house', '2024-10-07 10:30:31.479', '2024-10-07 10:30:31.479'),
(15, 'Happiness Is in Your Hormones. The 4 Most Important Ones You Should Know About - CNET', 'You have more control over your happiness than you think. What to know about naturally boosting your happiness hormones.', 'Unknown author', 'Health', 'Unknown author', 'https://www.cnet.com/health/mental/happiness-is-in-your-hormones-the-4-most-important-ones-you-should-know-about/', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(16, '[Removed]', '[Removed]', 'Unknown author', 'Health', 'Unknown author', 'https://removed.com', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(17, '47 tigers, 3 lions, panther confirmed dead at zoo - WKRC TV Cincinnati', 'PETA Senior Vice President Jason Baker called the incident \'tragic.\'', 'HAU DINH Associated Press', 'Health', 'HAU DINH Associated Press', 'https://local12.com/news/nation-world/vuon-xoai-zoo-47-tigers-3-lions-panther-confirmed-die-dies-dead-mass-death-incident-cincinnati-manager-health-conditions-danger-dangerous-situations-capt', '2024-10-07 10:30:31.480', '2024-10-07 10:30:31.480'),
(18, '3 Deadly Health Hazards Of An Unhappy Marriage—By A Psychologist - Forbes', 'Here\'s why marital stress extends beyond emotional suffering and can become a significant health risk.', 'Mark Travers', 'Health', 'Mark Travers', 'https://www.forbes.com/sites/traversmark/2024/10/05/3-deadly-health-hazards-of-an-unhappy-marriage-by-a-psychologist/', '2024-10-07 10:30:31.512', '2024-10-07 10:30:31.512'),
(19, 'Young children anticipate actions through mirror neuron system by age three - PsyPost', 'New research suggests that by age three, children’s mirror neurons help them understand and anticipate others\' intentions, highlighting early social-cognitive development.', 'Eric W. Dolan', 'Health', 'Eric W. Dolan', 'https://www.psypost.org/young-children-anticipate-actions-through-mirror-neuron-system-by-age-three/', '2024-10-07 10:30:31.512', '2024-10-07 10:30:31.512'),
(20, 'Glucose: The sweet secret to a younger brain? - Earth.com', 'Stanford research uncovers glucose’s role in boosting neurogenesis, offering insights into brain aging interventions.', 'Unknown author', 'Health', 'Unknown author', 'https://www.earth.com/news/glucose-the-sweet-secret-to-a-younger-brain/', '2024-10-07 10:30:31.512', '2024-10-07 10:30:31.512'),
(21, 'Workout in a Pill: Scientists Develop Molecule That Mimics the Benefits of Exercise and Fasting - SciTechDaily', 'Researchers at Aarhus University have synthesized a molecule called LaKe that replicates the metabolic effects of exercise and fasting. This advancement allows the body to mimic the beneficia', 'Unknown author', 'Health', 'Unknown author', 'https://scitechdaily.com/workout-in-a-pill-scientists-develop-molecule-that-mimics-the-benefits-of-exercise-and-fasting/', '2024-10-07 10:58:25.970', '2024-10-07 10:58:25.970'),
(22, '47 tigers, 3 lions, panther confirmed dead at zoo - WKRC TV Cincinnati', 'PETA Senior Vice President Jason Baker called the incident \'tragic.\'', 'HAU DINH Associated Press', 'Health', 'HAU DINH Associated Press', 'https://local12.com/news/nation-world/vuon-xoai-zoo-47-tigers-3-lions-panther-confirmed-die-dies-dead-mass-death-incident-cincinnati-manager-health-conditions-danger-dangerous-situations-capt', '2024-10-07 10:58:25.983', '2024-10-07 10:58:25.983'),
(23, 'Researchers say a quick cheek swab can accurately predict how long you have left to live - BGR', 'A new tool can predict how long you\'ll live just by looking at biological markers gathered with a simple cheek swab.', 'Joshua Hawkins, Joshua Hawkins', 'Health', 'Joshua Hawkins, Joshua Hawkins', 'https://bgr.com/science/researchers-say-a-quick-cheek-swab-can-accurately-predict-how-long-you-have-left-to-live/', '2024-10-07 10:58:25.983', '2024-10-07 10:58:25.983'),
(24, 'New Molecule Offers Hope for Parkinson’s by Outperforming L-Dopa - Neuroscience News', 'A new study has discovered that ophthalmic acid, a molecule in the brain, acts like a neurotransmitter to regulate motor function, similar to dopamine.', 'Neuroscience News', 'Health', 'Neuroscience News', 'https://neurosciencenews.com/parkinsons-ophthalmic-acid-27789/', '2024-10-07 10:58:25.983', '2024-10-07 10:58:25.983'),
(25, 'Lack of sleep during pregnancy could impact baby\'s development, study reveals - Fox News', 'New research found that short sleep duration in pregnant women can lead to neurodevelopmental delays in their children after they are born. Experts discuss the risks and how to prevent them.', 'Angelica Stabile', 'Health', 'Angelica Stabile', 'https://www.foxnews.com/health/lack-sleep-during-pregnancy-could-impact-baby-development-study-reveals', '2024-10-07 10:58:25.970', '2024-10-07 10:58:25.970'),
(26, 'Congo finally begins mpox vaccinations in a drive to slow outbreaks - The Associated Press', 'Congolese authorities have started vaccinations against mpox, nearly two months after the disease outbreak that spread from Congo to several other African countries and beyond was declared a ', 'RUTH ALONGA', 'Health', 'RUTH ALONGA', 'https://apnews.com/article/congo-mpox-vaccination-goma-26cb3224edf6fe28b5db507241fee68f', '2024-10-07 10:58:25.970', '2024-10-07 10:58:25.970'),
(27, 'Fat Alone Doesn’t Disrupt Brain’s Appetite Neurons - Neuroscience News', 'A new study reveals that a high-fat diet alone does not appear to be responsible for changes in brain neurons that regulate appetite and energy balance.', 'Neuroscience News', 'Health', 'Neuroscience News', 'https://neurosciencenews.com/fat-sugar-appetite-neurons-27790/', '2024-10-07 10:58:25.990', '2024-10-07 10:58:25.990'),
(28, '47 tigers, 3 lions, panther confirmed dead at zoo - WKRC TV Cincinnati', 'PETA Senior Vice President Jason Baker called the incident \'tragic.\'', 'HAU DINH Associated Press', 'Health', 'HAU DINH Associated Press', 'https://local12.com/news/nation-world/vuon-xoai-zoo-47-tigers-3-lions-panther-confirmed-die-dies-dead-mass-death-incident-cincinnati-manager-health-conditions-danger-dangerous-situations-capt', '2024-10-07 12:40:53.113', '2024-10-07 12:40:53.113'),
(29, '47 tigers, 3 lions, panther confirmed dead at zoo - WKRC TV Cincinnati', 'PETA Senior Vice President Jason Baker called the incident \'tragic.\'', 'HAU DINH Associated Press', 'Health', 'HAU DINH Associated Press', 'https://local12.com/news/nation-world/vuon-xoai-zoo-47-tigers-3-lions-panther-confirmed-die-dies-dead-mass-death-incident-cincinnati-manager-health-conditions-danger-dangerous-situations-capt', '2024-10-07 12:52:29.340', '2024-10-07 12:52:29.340'),
(30, '47 tigers, 3 lions, panther confirmed dead at zoo - WKRC TV Cincinnati', 'PETA Senior Vice President Jason Baker called the incident \'tragic.\'', 'HAU DINH Associated Press', 'Health', 'HAU DINH Associated Press', 'https://local12.com/news/nation-world/vuon-xoai-zoo-47-tigers-3-lions-panther-confirmed-die-dies-dead-mass-death-incident-cincinnati-manager-health-conditions-danger-dangerous-situations-capt', '2024-10-07 12:54:12.757', '2024-10-07 12:54:12.757'),
(31, 'The 6 Best Anti-Inflammatory Frozen Veggies, According to Dietitians - EatingWell', 'The freezer aisle is packed with veggies that dietitians lean on to fight inflammation, like leafy greens, sweet potatoes, peas, peppers and onions.', 'https://www.facebook.com/EatingWell/', 'Health', 'https://www.facebook.com/EatingWell/', 'https://www.eatingwell.com/the-best-anti-inflammatory-frozen-veggies-8723520', '2024-10-07 15:42:27.667', '2024-10-07 15:42:27.667'),
(32, 'Rates of sudden unexplained infant deaths increased during pandemic - The Washington Post', 'Researchers noted a “pronounced epidemiologic shift” in the deaths between June and December 2021.', 'Erin Blakemore', 'Health', 'Erin Blakemore', 'https://www.washingtonpost.com/health/2024/10/06/sids-baby-deaths-pandemic-rsv/', '2024-10-07 15:42:27.667', '2024-10-07 15:42:27.667'),
(33, 'US ships Marburg vaccines to Rwanda after 11 die in outbreak - Reuters', 'The United States government completed an initial shipment of vaccine doses and therapeutic drugs for Marburg disease to Rwanda on Oct. 4, Thierry Roels, U.S. CDC Country Director in Rwanda t', 'Philbert Girinema, Chandni Shah', 'Health', 'Philbert Girinema, Chandni Shah', 'https://www.reuters.com/world/africa/us-ships-marburg-vaccines-rwanda-after-11-die-outbreak-2024-10-05/', '2024-10-07 15:42:27.734', '2024-10-07 15:42:27.734'),
(34, 'Absolutely Deranged Study Says Swallowing Makes You Happy and Is Why You Overeat - Futurism', 'Groundbreaking, surprising research reveals that the joy of swallowing, not just taste or aroma, drives our eating habits.', 'Foster Kamer', 'Health', 'Foster Kamer', 'https://futurism.com/neoscope/overeating-swallowing-study-esophagus-disorders-serotonin', '2024-10-07 15:42:27.667', '2024-10-07 15:42:27.667'),
(35, 'Alzheimer’s Breakthrough: Synthetic THC Pill Proves Effective in Clinical Trial - SciTechDaily', 'Patients tolerated synthetic THC (dronabinol) well, without the adverse effects commonly associated with existing Alzheimer\'s agitation medications. A study conducted by researchers from John', 'Unknown author', 'Health', 'Unknown author', 'https://scitechdaily.com/alzheimers-breakthrough-synthetic-thc-pill-proves-effective-in-clinical-trial/', '2024-10-07 15:42:27.667', '2024-10-07 15:42:27.667'),
(36, 'Rwanda begins vaccination drive to curb Marburg virus outbreak - Al Jazeera English', 'Government to prioritise those ‘most at risk’ and ‘most exposed healthcare workers’ following the deaths of 12 people.', 'Al Jazeera', 'Health', 'Al Jazeera', 'https://www.aljazeera.com/news/2024/10/6/rwanda-begins-vaccination-drive-to-curb-marburg-virus-outbreak', '2024-10-07 17:14:01.872', '2024-10-07 17:14:01.872'),
(37, 'Health Effects Of Art In The Spotlight At Neuroscience Conference - Forbes', 'Neuroscientists are meeting in Chicago to talk about the cutting edge topics in their field. That includes the neuroscience of art.', 'Eva Amsen', 'Health', 'Eva Amsen', 'https://www.forbes.com/sites/evaamsen/2024/10/05/health-effects-of-art-in-the-spotlight-at-neuroscience-conference/', '2024-10-07 21:00:05.911', '2024-10-07 21:00:05.911'),
(38, 'County investigates first locally acquired dengue case in Escondido - FOX 5 San Diego', 'The San Diego County Health Department is investigating the first-ever case of locally acquired dengue fever after an Escondido resident fell ill without a recent history of travel to endemic', 'Amber Coakley', 'Health', 'Amber Coakley', 'https://fox5sandiego.com/news/local-news/county-investigates-first-locally-acquired-dengue-case-in-escondido/', '2024-10-07 21:00:05.918', '2024-10-07 21:00:05.918'),
(39, 'Fun New Mouth Swab Will Tell You When You’ll Die - Futurism', 'Scientists have devised a fascinating way to determine when you may die — and all it takes is a simple cheek swab.', 'Noor Al-Sibai', 'Health', 'Noor Al-Sibai', 'https://futurism.com/neoscope/cheek-swab-mortality-epigenetics', '2024-10-07 21:00:05.910', '2024-10-07 21:00:05.910'),
(40, 'What are legumes? Why nutrition experts love TikTok\'s dense bean salad trend - USA TODAY', 'Is it OK to eat beans and legumes every day?\nEnter the \"dense bean salad\" trend.', 'Hannah Yasharoff', 'Health', 'Hannah Yasharoff', 'https://www.usatoday.com/story/life/health-wellness/2024/10/06/what-are-legumes/75311984007/', '2024-10-07 21:00:05.905', '2024-10-07 21:00:05.905'),
(41, 'Rwanda starts vaccine trials against deadly Marburg virus - BBC.com', 'The health ministry says there are at least 46 cases in the east African country.', 'Unknown author', 'Health', 'Unknown author', 'https://www.bbc.com/news/articles/ckgmvjxek7wo', '2024-10-07 21:00:05.904', '2024-10-07 21:00:05.904'),
(42, 'A Simple Eating Habit May Slash Your Risk for Diabetes and Heart Disease - SciTechDaily', 'Researchers discovered that restricting food intake to a 10-hour daily window enhanced important markers of heart health. It is estimated that over one-third of adults in the United States ha', 'Unknown author', 'Health', 'Unknown author', 'https://scitechdaily.com/a-simple-eating-habit-may-slash-your-risk-for-diabetes-and-heart-disease/', '2024-10-07 21:00:05.911', '2024-10-07 21:00:05.911'),
(43, 'Hearing Loss Disrupts Speech Coordination - Neuroscience News', 'Researchers found that when individuals briefly couldn\'t hear their own speech, their ability to control their jaw and tongue movements declined.', 'Neuroscience News', 'Health', 'Neuroscience News', 'https://neurosciencenews.com/hearing-loss-speech-coordination-27793/', '2024-10-07 21:00:05.904', '2024-10-07 21:00:05.904'),
(44, 'A “Silver Bullet” for Cancer? Scientists Uncover Secret Power of RNA - SciTechDaily', 'RNA plays an increasingly significant role in human gene expression. Within each cell, inside every nucleus, your survival relies on an intricate and highly complex process. Proteins are cont', 'Unknown author', 'Health', 'Unknown author', 'https://scitechdaily.com/a-silver-bullet-for-cancer-scientists-uncover-secret-power-of-rna/', '2024-10-07 21:09:41.790', '2024-10-07 21:09:41.790'),
(45, 'Study Finds Wegovy Reduces COVID-19 Death Risk by One-Third - Neuroscience News', 'A new trial reveals that weekly injections of the weight-loss drug Wegovy (semaglutide) lowered the risk of death from COVID-19 by about a third and reduced overall mortality by 19%.', 'Neuroscience News', 'Health', 'Neuroscience News', 'https://neurosciencenews.com/wegovy-covid-death-27795/', '2024-10-07 21:09:41.790', '2024-10-07 21:09:41.790'),
(46, 'Are Today\'s Popular Soda Alternatives Actually Healthy? - HuffPost', 'They’re fun and flavorful, but how many a day is too many? And which ones are best to avoid? Some experts offer words of advice.', 'Julie Kendrick', 'Health', 'Julie Kendrick', 'https://www.huffpost.com/entry/are-todays-popular-soda-alternatives-actually-healthy-goog_l_66fec725e4b089d324aa3c45', '2024-10-07 21:09:42.151', '2024-10-07 21:09:42.151');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `content` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymentmethod`
--

CREATE TABLE `paymentmethod` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` varchar(191) NOT NULL,
  `provider` varchar(191) NOT NULL,
  `last4` varchar(191) DEFAULT NULL,
  `cardType` varchar(191) DEFAULT NULL,
  `expMonth` int(11) DEFAULT NULL,
  `expYear` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `paymentmethod`
--

INSERT INTO `paymentmethod` (`id`, `userId`, `type`, `provider`, `last4`, `cardType`, `expMonth`, `expYear`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'credit_card', 'Visa', '6565', 'Debit', 10, 2028, '2024-10-07 15:34:06.745', '2024-10-07 15:34:06.745');

-- --------------------------------------------------------

--
-- Table structure for table `prescription`
--

CREATE TABLE `prescription` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `doctor` varchar(191) NOT NULL,
  `medicines` varchar(191) NOT NULL,
  `dosage` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `teleconsultationId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `prescription`
--

INSERT INTO `prescription` (`id`, `userId`, `doctor`, `medicines`, `dosage`, `createdAt`, `updatedAt`, `teleconsultationId`) VALUES
(1, 2, 'Kidus  Yohannes', 'Amoxicilin', '200mg', '2024-10-07 12:47:33.219', '2024-10-07 12:47:33.219', 5),
(2, 2, 'Kidus  Yohannes', '', '', '2024-10-07 16:06:34.017', '2024-10-07 16:06:34.017', 6),
(3, 2, 'Kidus  Yohannes', 'Amoxicilin', '200mg', '2024-10-07 17:21:28.101', '2024-10-07 17:21:28.101', 8),
(4, 2, 'Kidus  Yohannes', 'Amoxicilin', '200mg', '2024-10-07 17:32:16.937', '2024-10-07 17:32:16.937', 9),
(5, 2, 'Kiduse Yohannes', 'Diclodenc ', '10mg', '2024-10-07 22:06:27.285', '2024-10-07 22:06:27.285', 10),
(6, 2, 'Kiduse Yohannes', '', '', '2024-10-07 22:41:34.036', '2024-10-07 22:41:34.036', 11),
(7, 2, 'Kiduse Yohannes', 'Paracetamol', '10mg', '2024-10-07 22:43:21.934', '2024-10-07 22:43:21.934', 12),
(8, 1, 'Kidus  Yohannes', '', '', '2024-10-07 22:43:38.090', '2024-10-07 22:43:38.090', 7);

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` varchar(191) NOT NULL,
  `sessionToken` varchar(191) NOT NULL,
  `userId` int(11) NOT NULL,
  `expires` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supportticket`
--

CREATE TABLE `supportticket` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Open',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `supportticket`
--

INSERT INTO `supportticket` (`id`, `userId`, `title`, `message`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 3, 'Something is wrong with my transaction', 'I ned your help pleaseeeeeeeeeeeeee', 'Closed', '2024-10-07 12:53:11.253', '2024-10-07 12:54:54.370'),
(2, 3, 'I need your help', 'Help me pleaseeeeeeeeeeeeeeeee', 'Closed', '2024-10-07 12:56:15.728', '2024-10-07 12:56:44.989'),
(3, 2, 'I have a problem', 'please help meeee', 'Resolved', '2024-10-07 16:09:11.594', '2024-10-07 16:10:30.373'),
(4, 2, 'Hello there', 'I am feeeling a bit tired, what shoulkd I do', 'Closed', '2024-10-07 22:47:44.226', '2024-10-07 22:48:15.440');

-- --------------------------------------------------------

--
-- Table structure for table `teleconsultation`
--

CREATE TABLE `teleconsultation` (
  `id` int(11) NOT NULL,
  `date` datetime(3) NOT NULL,
  `userId` int(11) NOT NULL,
  `teleconsultorId` int(11) NOT NULL,
  `doctor` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL,
  `sessionUrl` varchar(191) DEFAULT NULL,
  `paymentStatus` varchar(191) NOT NULL DEFAULT 'Pending',
  `notes` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teleconsultation`
--

INSERT INTO `teleconsultation` (`id`, `date`, `userId`, `teleconsultorId`, `doctor`, `status`, `sessionUrl`, `paymentStatus`, `notes`, `createdAt`, `updatedAt`) VALUES
(1, '2024-10-11 10:30:00.000', 2, 1, 'Kidus  Yohannes', 'Pending Payment', NULL, 'Pending', NULL, '2024-10-07 10:36:15.354', '2024-10-07 10:36:15.354'),
(2, '2024-10-18 10:39:00.000', 2, 1, 'Kidus  Yohannes', 'Pending Payment', NULL, 'Pending', NULL, '2024-10-07 10:39:50.363', '2024-10-07 10:39:50.363'),
(3, '2024-10-18 10:39:00.000', 2, 1, 'Kidus  Yohannes', 'Completed', 'https://healthhub.daily.co/1TMpkGSPcQiEzwbEOXmt', 'Approved', NULL, '2024-10-07 10:40:16.151', '2024-10-07 10:40:16.151'),
(4, '2024-10-09 12:32:00.000', 2, 1, 'Kidus  Yohannes', 'Completed', NULL, 'Approved', 'He is a bit sick', '2024-10-07 12:33:00.240', '2024-10-07 12:33:00.240'),
(5, '2024-10-11 12:43:00.000', 2, 1, 'Kidus  Yohannes', 'Completed', NULL, 'Approved', 'The user is a bit sick', '2024-10-07 12:43:16.887', '2024-10-07 12:43:16.887'),
(6, '2024-10-08 08:02:00.000', 2, 1, 'Kidus  Yohannes', 'Completed', NULL, 'Approved', '', '2024-10-07 16:03:15.948', '2024-10-07 16:03:15.948'),
(7, '2024-10-08 08:42:00.000', 1, 1, 'Kidus  Yohannes', 'Completed', NULL, 'Approved', '', '2024-10-07 16:42:17.821', '2024-10-07 16:42:17.821'),
(8, '2024-10-08 08:18:00.000', 2, 1, 'Kidus  Yohannes', 'Completed', NULL, 'Approved', 'Not', '2024-10-07 17:18:41.535', '2024-10-07 17:18:41.535'),
(9, '2024-10-07 08:29:00.000', 2, 1, 'Kidus  Yohannes', 'Completed', NULL, 'Approved', 'New things ', '2024-10-07 17:30:03.903', '2024-10-07 17:30:03.903'),
(10, '2024-10-08 08:03:00.000', 2, 1, 'Kiduse Yohannes', 'Completed', NULL, 'Approved', 'This patient is a bit sick', '2024-10-07 22:03:32.651', '2024-10-07 22:03:32.651'),
(11, '2024-10-08 08:37:00.000', 2, 1, 'Kiduse Yohannes', 'Completed', NULL, 'Approved', 'Hello ', '2024-10-07 22:37:59.304', '2024-10-07 22:37:59.304'),
(12, '2024-10-08 07:41:00.000', 2, 1, 'Kiduse Yohannes', 'Completed', NULL, 'Approved', 'Hello there', '2024-10-07 22:42:07.843', '2024-10-07 22:42:07.843');

-- --------------------------------------------------------

--
-- Table structure for table `teleconsultor`
--

CREATE TABLE `teleconsultor` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `workingHours` varchar(191) DEFAULT NULL,
  `specialties` varchar(191) DEFAULT NULL,
  `doctorInfo` varchar(191) DEFAULT NULL,
  `rate` double DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teleconsultor`
--

INSERT INTO `teleconsultor` (`id`, `userId`, `workingHours`, `specialties`, `doctorInfo`, `rate`, `rating`, `createdAt`, `updatedAt`) VALUES
(1, 1, '2 - 3 am', 'Mind Reader', 'I am a specialized doctor', 1000, 1, '2024-10-07 13:28:31.000', '2024-10-07 22:43:51.935');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `appointmentId` int(11) DEFAULT NULL,
  `teleconsultationId` int(11) DEFAULT NULL,
  `txRef` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL,
  `amount` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`id`, `userId`, `appointmentId`, `teleconsultationId`, `txRef`, `status`, `amount`, `createdAt`, `updatedAt`) VALUES
(1, 2, NULL, 3, 'TX-USER-1728297624400-3', 'Completed', 1000, '2024-10-07 10:40:24.494', '2024-10-07 10:40:24.494'),
(2, 1, NULL, 3, 'TX-TELECONSULTOR-1728297624400-3', 'Completed', 800, '2024-10-07 10:40:24.638', '2024-10-07 10:40:24.638'),
(3, 3, NULL, 3, 'TX-ADMIN-1728297624400-3', 'Completed', 200, '2024-10-07 10:40:24.774', '2024-10-07 10:40:24.774'),
(4, 2, NULL, 4, 'TX-USER-1728304390567-4', 'Completed', 1000, '2024-10-07 12:33:10.834', '2024-10-07 12:33:10.834'),
(5, 1, NULL, 4, 'TX-TELECONSULTOR-1728304390567-4', 'Completed', 800, '2024-10-07 12:33:11.071', '2024-10-07 12:33:11.071'),
(6, 3, NULL, 4, 'TX-ADMIN-1728304390567-4', 'Completed', 200, '2024-10-07 12:33:11.186', '2024-10-07 12:33:11.186'),
(7, 2, NULL, 5, 'TX-USER-1728305008983-5', 'Completed', 1000, '2024-10-07 12:43:29.010', '2024-10-07 12:43:29.010'),
(8, 1, NULL, 5, 'TX-TELECONSULTOR-1728305008983-5', 'Completed', 800, '2024-10-07 12:43:29.163', '2024-10-07 12:43:29.163'),
(9, 3, NULL, 5, 'TX-ADMIN-1728305008983-5', 'Completed', 200, '2024-10-07 12:43:29.401', '2024-10-07 12:43:29.401'),
(10, 2, NULL, 6, 'TX-USER-1728317012564-6', 'Completed', 1000, '2024-10-07 16:03:32.649', '2024-10-07 16:03:32.649'),
(11, 1, NULL, 6, 'TX-TELECONSULTOR-1728317012564-6', 'Completed', 800, '2024-10-07 16:03:32.785', '2024-10-07 16:03:32.785'),
(12, 3, NULL, 6, 'TX-ADMIN-1728317012564-6', 'Completed', 200, '2024-10-07 16:03:32.971', '2024-10-07 16:03:32.971'),
(13, 1, NULL, 7, 'TX-USER-1728319371561-7', 'Completed', 1000, '2024-10-07 16:42:51.679', '2024-10-07 16:42:51.679'),
(14, 1, NULL, 7, 'TX-TELECONSULTOR-1728319371561-7', 'Completed', 800, '2024-10-07 16:42:52.066', '2024-10-07 16:42:52.066'),
(15, 3, NULL, 7, 'TX-ADMIN-1728319371561-7', 'Completed', 200, '2024-10-07 16:42:52.136', '2024-10-07 16:42:52.136'),
(16, 2, NULL, 8, 'TX-USER-1728321534830-8', 'Completed', 1000, '2024-10-07 17:18:55.142', '2024-10-07 17:18:55.142'),
(17, 1, NULL, 8, 'TX-TELECONSULTOR-1728321534830-8', 'Completed', 800, '2024-10-07 17:18:55.336', '2024-10-07 17:18:55.336'),
(18, 3, NULL, 8, 'TX-ADMIN-1728321534830-8', 'Completed', 200, '2024-10-07 17:18:55.490', '2024-10-07 17:18:55.490'),
(19, 2, NULL, 9, 'TX-USER-1728322216956-9', 'Completed', 1000, '2024-10-07 17:30:17.072', '2024-10-07 17:30:17.072'),
(20, 1, NULL, 9, 'TX-TELECONSULTOR-1728322216956-9', 'Completed', 800, '2024-10-07 17:30:17.332', '2024-10-07 17:30:17.332'),
(21, 3, NULL, 9, 'TX-ADMIN-1728322216956-9', 'Completed', 200, '2024-10-07 17:30:17.514', '2024-10-07 17:30:17.514'),
(22, 2, NULL, 10, 'TX-USER-1728338642803-10', 'Completed', 1000, '2024-10-07 22:04:02.900', '2024-10-07 22:04:02.900'),
(23, 1, NULL, 10, 'TX-TELECONSULTOR-1728338642803-10', 'Completed', 800, '2024-10-07 22:04:03.092', '2024-10-07 22:04:03.092'),
(24, 3, NULL, 10, 'TX-ADMIN-1728338642803-10', 'Completed', 200, '2024-10-07 22:04:03.159', '2024-10-07 22:04:03.159'),
(25, 2, NULL, 11, 'TX-USER-1728340687218-11', 'Completed', 1000, '2024-10-07 22:38:07.247', '2024-10-07 22:38:07.247'),
(26, 1, NULL, 11, 'TX-TELECONSULTOR-1728340687218-11', 'Completed', 800, '2024-10-07 22:38:07.392', '2024-10-07 22:38:07.392'),
(27, 3, NULL, 11, 'TX-ADMIN-1728340687218-11', 'Completed', 200, '2024-10-07 22:38:07.493', '2024-10-07 22:38:07.493'),
(28, 2, NULL, 12, 'TX-USER-1728340935860-12', 'Completed', 1000, '2024-10-07 22:42:15.917', '2024-10-07 22:42:15.917'),
(29, 1, NULL, 12, 'TX-TELECONSULTOR-1728340935860-12', 'Completed', 800, '2024-10-07 22:42:16.051', '2024-10-07 22:42:16.051'),
(30, 3, NULL, 12, 'TX-ADMIN-1728340935860-12', 'Completed', 200, '2024-10-07 22:42:16.310', '2024-10-07 22:42:16.310');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `firstName` varchar(191) DEFAULT NULL,
  `lastName` varchar(191) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `location` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `role` enum('USER','TELECONSULTER','HEALTHCARE_FACILITY','ADMIN') NOT NULL DEFAULT 'USER',
  `status` enum('PENDING','APPROVED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `healthcareFacilityId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `firstName`, `lastName`, `email`, `password`, `location`, `phone`, `role`, `status`, `createdAt`, `updatedAt`, `healthcareFacilityId`) VALUES
(1, 'Kiduse', 'Yohannes', 'kidusyoh@outlook.com', '$2a$12$ogzcV0DQa2Qvgd26UJV5Bu6BhdsbnO5ykUE2sC4cDck8gmqv0C2tO', NULL, 'kidus@gmail.com', 'TELECONSULTER', 'APPROVED', '2024-10-07 10:26:16.722', '2024-10-07 19:08:33.972', NULL),
(2, 'Daniel', 'Desisa', 'kidyoh789@gmail.com', '$2b$10$Ed2/yJQIZ6LpA4GMl3iFguKFApwzf9.LUk0jHKnnyaZd46iVHtbfu', NULL, '+251923084916', 'USER', 'APPROVED', '2024-10-07 10:26:38.095', '2024-10-07 12:42:26.674', NULL),
(3, 'Michael', 'Tamirat', 'danieldesisa75@gmail.com', '$2b$10$23RAL7KvdUGMkPbfwmB6ZOGUpH9fSiC9jxr19hNRNIphKSi5XhHqi', NULL, NULL, 'ADMIN', 'APPROVED', '2024-10-07 10:27:16.701', '2024-10-07 10:27:16.701', NULL),
(4, 'Kidusee', 'Yohannese', 'kidusee@gmail.com', '123456', NULL, 'kidus@gmail.com', 'TELECONSULTER', 'APPROVED', '2024-10-07 19:10:10.292', '2024-10-07 19:10:22.731', NULL),
(5, 'Solomon', 'Emrie', 'Solomon@gmail.com', '12345', 'Latitude: 11.0579789, Longitude: 39.754941', '+2598898989', 'HEALTHCARE_FACILITY', 'APPROVED', '2024-10-07 19:12:27.441', '2024-10-07 19:17:06.523', 1);

-- --------------------------------------------------------

--
-- Table structure for table `_diagnosistoteleconsultation`
--

CREATE TABLE `_diagnosistoteleconsultation` (
  `A` int(11) NOT NULL,
  `B` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_feedbacktoteleconsultor`
--

CREATE TABLE `_feedbacktoteleconsultor` (
  `A` int(11) NOT NULL,
  `B` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('36e4372c-8094-4661-977a-d628ac904d69', 'abc09b2cc90564d9212ed3129eb777001d3075f107f30e8f4ce7320dc9fd356f', '2024-10-07 14:39:32.959', '20241007143929_add_availability_to_teleconsultor', NULL, NULL, '2024-10-07 14:39:30.588', 1),
('8a03c117-eeda-4336-9b2d-c8617203c3ff', '743f9597a16eba71bbe817ad448cb0d9d5dc38549efe2eec56796fd8b7ed370c', '2024-10-07 10:24:46.686', '20241007102420_add_teleconsultor_id_to_teleconsultation', NULL, NULL, '2024-10-07 10:24:20.442', 1),
('a56ea3a6-1d6e-4d36-9ef7-7b6c3145ce82', '1df3ba1590d2d40021446b3a9e12fe3318c6348b1d7d2e07f5990110861fd515', '2024-10-07 12:39:33.683', '20241007123931_add_teleconsultor_id_to_prescription', NULL, NULL, '2024-10-07 12:39:32.005', 1),
('a7447e28-a29e-4a5b-907f-13147bee6ee0', 'a29503d1552a86f36b28bce7a338da2340563b41aa74cb019db0f45dd8201122', '2024-10-07 15:21:36.332', '20241007152135_add_appointment_price_for_healthfacility', NULL, NULL, '2024-10-07 15:21:36.067', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Appointment_prescriptionId_key` (`prescriptionId`),
  ADD KEY `Appointment_userId_idx` (`userId`),
  ADD KEY `Appointment_facilityId_idx` (`facilityId`),
  ADD KEY `Appointment_teleconsultationId_idx` (`teleconsultationId`),
  ADD KEY `Appointment_feedbackId_idx` (`feedbackId`);

--
-- Indexes for table `availability`
--
ALTER TABLE `availability`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Availability_teleconsultorId_fkey` (`teleconsultorId`);

--
-- Indexes for table `chatsession`
--
ALTER TABLE `chatsession`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ChatSession_userId_idx` (`userId`);

--
-- Indexes for table `diagnosis`
--
ALTER TABLE `diagnosis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Diagnosis_userId_idx` (`userId`),
  ADD KEY `Diagnosis_chatSessionId_idx` (`chatSessionId`);

--
-- Indexes for table `emergencyservice`
--
ALTER TABLE `emergencyservice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Feedback_appointmentId_key` (`appointmentId`),
  ADD KEY `Feedback_userId_idx` (`userId`),
  ADD KEY `Feedback_teleconsultationId_idx` (`teleconsultationId`),
  ADD KEY `Feedback_appointmentId_idx` (`appointmentId`);

--
-- Indexes for table `healthcarefacility`
--
ALTER TABLE `healthcarefacility`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `healthtip`
--
ALTER TABLE `healthtip`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `helparticle`
--
ALTER TABLE `helparticle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `HelpArticle_authorId_fkey` (`authorId`);

--
-- Indexes for table `medicalinformation`
--
ALTER TABLE `medicalinformation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Notification_userId_idx` (`userId`);

--
-- Indexes for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PaymentMethod_userId_idx` (`userId`);

--
-- Indexes for table `prescription`
--
ALTER TABLE `prescription`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Prescription_userId_idx` (`userId`),
  ADD KEY `Prescription_teleconsultationId_idx` (`teleconsultationId`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Session_sessionToken_key` (`sessionToken`),
  ADD KEY `Session_userId_idx` (`userId`);

--
-- Indexes for table `supportticket`
--
ALTER TABLE `supportticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `SupportTicket_userId_fkey` (`userId`);

--
-- Indexes for table `teleconsultation`
--
ALTER TABLE `teleconsultation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Teleconsultation_userId_idx` (`userId`),
  ADD KEY `Teleconsultation_teleconsultorId_idx` (`teleconsultorId`);

--
-- Indexes for table `teleconsultor`
--
ALTER TABLE `teleconsultor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Teleconsultor_userId_key` (`userId`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Transaction_txRef_key` (`txRef`),
  ADD KEY `Transaction_userId_idx` (`userId`),
  ADD KEY `Transaction_appointmentId_idx` (`appointmentId`),
  ADD KEY `Transaction_teleconsultationId_idx` (`teleconsultationId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD UNIQUE KEY `User_healthcareFacilityId_key` (`healthcareFacilityId`);

--
-- Indexes for table `_diagnosistoteleconsultation`
--
ALTER TABLE `_diagnosistoteleconsultation`
  ADD UNIQUE KEY `_DiagnosisToTeleconsultation_AB_unique` (`A`,`B`),
  ADD KEY `_DiagnosisToTeleconsultation_B_index` (`B`);

--
-- Indexes for table `_feedbacktoteleconsultor`
--
ALTER TABLE `_feedbacktoteleconsultor`
  ADD UNIQUE KEY `_FeedbackToTeleconsultor_AB_unique` (`A`,`B`),
  ADD KEY `_FeedbackToTeleconsultor_B_index` (`B`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `availability`
--
ALTER TABLE `availability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `chatsession`
--
ALTER TABLE `chatsession`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `diagnosis`
--
ALTER TABLE `diagnosis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `emergencyservice`
--
ALTER TABLE `emergencyservice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `healthcarefacility`
--
ALTER TABLE `healthcarefacility`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `healthtip`
--
ALTER TABLE `healthtip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `helparticle`
--
ALTER TABLE `helparticle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `medicalinformation`
--
ALTER TABLE `medicalinformation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `prescription`
--
ALTER TABLE `prescription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `supportticket`
--
ALTER TABLE `supportticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `teleconsultation`
--
ALTER TABLE `teleconsultation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `teleconsultor`
--
ALTER TABLE `teleconsultor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `Appointment_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `healthcarefacility` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Appointment_prescriptionId_fkey` FOREIGN KEY (`prescriptionId`) REFERENCES `prescription` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Appointment_teleconsultationId_fkey` FOREIGN KEY (`teleconsultationId`) REFERENCES `teleconsultation` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `availability`
--
ALTER TABLE `availability`
  ADD CONSTRAINT `Availability_teleconsultorId_fkey` FOREIGN KEY (`teleconsultorId`) REFERENCES `teleconsultor` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `chatsession`
--
ALTER TABLE `chatsession`
  ADD CONSTRAINT `ChatSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `diagnosis`
--
ALTER TABLE `diagnosis`
  ADD CONSTRAINT `Diagnosis_chatSessionId_fkey` FOREIGN KEY (`chatSessionId`) REFERENCES `chatsession` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Diagnosis_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `Feedback_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `appointment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Feedback_teleconsultationId_fkey` FOREIGN KEY (`teleconsultationId`) REFERENCES `teleconsultation` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `helparticle`
--
ALTER TABLE `helparticle`
  ADD CONSTRAINT `HelpArticle_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  ADD CONSTRAINT `PaymentMethod_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `prescription`
--
ALTER TABLE `prescription`
  ADD CONSTRAINT `Prescription_teleconsultationId_fkey` FOREIGN KEY (`teleconsultationId`) REFERENCES `teleconsultation` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Prescription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `supportticket`
--
ALTER TABLE `supportticket`
  ADD CONSTRAINT `SupportTicket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `teleconsultation`
--
ALTER TABLE `teleconsultation`
  ADD CONSTRAINT `Teleconsultation_teleconsultorId_fkey` FOREIGN KEY (`teleconsultorId`) REFERENCES `teleconsultor` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Teleconsultation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `teleconsultor`
--
ALTER TABLE `teleconsultor`
  ADD CONSTRAINT `Teleconsultor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `Transaction_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `appointment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Transaction_teleconsultationId_fkey` FOREIGN KEY (`teleconsultationId`) REFERENCES `teleconsultation` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `User_healthcareFacilityId_fkey` FOREIGN KEY (`healthcareFacilityId`) REFERENCES `healthcarefacility` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `_diagnosistoteleconsultation`
--
ALTER TABLE `_diagnosistoteleconsultation`
  ADD CONSTRAINT `_DiagnosisToTeleconsultation_A_fkey` FOREIGN KEY (`A`) REFERENCES `diagnosis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_DiagnosisToTeleconsultation_B_fkey` FOREIGN KEY (`B`) REFERENCES `teleconsultation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `_feedbacktoteleconsultor`
--
ALTER TABLE `_feedbacktoteleconsultor`
  ADD CONSTRAINT `_FeedbackToTeleconsultor_A_fkey` FOREIGN KEY (`A`) REFERENCES `feedback` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_FeedbackToTeleconsultor_B_fkey` FOREIGN KEY (`B`) REFERENCES `teleconsultor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
