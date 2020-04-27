/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : eidea

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2020-04-27 22:07:18
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `carousel`
-- ----------------------------
DROP TABLE IF EXISTS `carousel`;
CREATE TABLE `carousel` (
  `goodsid` int(4) NOT NULL,
  `goodsname` varchar(50) CHARACTER SET utf8 NOT NULL,
  `goodsdetail` varchar(50) CHARACTER SET utf8 NOT NULL,
  `goodsprice` decimal(5,1) DEFAULT NULL,
  `goodsimg` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`goodsid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of carousel
-- ----------------------------
INSERT INTO `carousel` VALUES ('41', 'ACNE STUDIOS', '短款水洗牛仔夹克', '3000.0', 'homepage/04.gif');
INSERT INTO `carousel` VALUES ('42', 'Dreamland Syndicate', '字母动物印花短袖 T 恤', '599.0', 'homepage/01.gif');
INSERT INTO `carousel` VALUES ('43', 'ALEXANDER MCQUEEN', '迷彩圆领卫衣', '6200.0', 'homepage/02.gif');
INSERT INTO `carousel` VALUES ('44', 'OFF-WHITE c/o VIRGIL', '饰口袋印花迷彩双肩包', '5899.0', 'homepage/03.gif');
INSERT INTO `carousel` VALUES ('45', 'MSGM', 'Logo 印花双肩包', '5599.0', 'homepage/05.gif');

-- ----------------------------
-- Table structure for `collection`
-- ----------------------------
DROP TABLE IF EXISTS `collection`;
CREATE TABLE `collection` (
  `username` varchar(255) DEFAULT NULL,
  `goodsid` int(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of collection
-- ----------------------------
INSERT INTO `collection` VALUES ('kfd', '41');

-- ----------------------------
-- Table structure for `goods`
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `goodsid` int(4) NOT NULL AUTO_INCREMENT,
  `goodsname` varchar(50) NOT NULL,
  `goodsdetail` varchar(50) NOT NULL,
  `goodsprice` decimal(5,1) NOT NULL,
  `goodsimg` varchar(255) DEFAULT NULL,
  `sex` int(2) DEFAULT NULL COMMENT '1 for man,2 for lady',
  `classify` int(2) DEFAULT NULL COMMENT '1 for jacket, 2 for pants, 3 for shoes',
  PRIMARY KEY (`goodsid`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES ('1', 'THOM BROWNE', '标志缝饰拉链短袖衬衫', '4000.0', '1.jpg', '1', '1');
INSERT INTO `goods` VALUES ('2', 'ACNE STUDIOS', '植物印花短袖 T 恤', '1300.0', '2.jpg', '1', '1');
INSERT INTO `goods` VALUES ('3', 'STAMPD', '人像印花短袖 T 恤', '999.0', '3.jpg', '1', '1');
INSERT INTO `goods` VALUES ('4', 'STAMPD', '字母印花抽绳束脚长裤', '1999.0', '4.jpg', '1', '2');
INSERT INTO `goods` VALUES ('5', 'BAPE', 'Logo 印花迷彩圆领 T 恤', '999.0', '5.jpg', '1', '1');
INSERT INTO `goods` VALUES ('6', 'THOM BROWNE', '标志拼色系带低帮运动鞋', '4800.0', '6.jpg', '1', '3');
INSERT INTO `goods` VALUES ('7', 'MARCELO BURLON', '翅膀印花双色拼接短袖 T 恤', '1999.0', '7.jpg', '1', '1');
INSERT INTO `goods` VALUES ('8', 'THOM BROWNE', '条纹嵌花抽绳卫裤', '5200.0', '8.jpg', '1', '2');
INSERT INTO `goods` VALUES ('9', 'HUPOT', '磨损牛仔裤', '2299.0', '9.jpg', '1', '2');
INSERT INTO `goods` VALUES ('10', 'AMI', 'SMILEY 缝饰直排扣格纹衬衫', '2199.0', '10.jpg', '1', '1');
INSERT INTO `goods` VALUES ('11', 'NONA9ON', '字母刺绣牛仔夹克', '6399.0', '11.jpg', '1', '1');
INSERT INTO `goods` VALUES ('12', 'RICK OWENS', '拼色系带拉链高帮运动鞋', '7999.0', '12.jpg', '1', '3');
INSERT INTO `goods` VALUES ('13', 'MYNE', 'Logo 刺绣拼色落肩短袖 T 恤', '1899.0', '13.jpg', '1', '1');
INSERT INTO `goods` VALUES ('14', 'ALEXANDER MCQUEEN', '拼色长裤', '6200.0', '14.jpg', '1', '2');
INSERT INTO `goods` VALUES ('15', 'ALEXANDER MCQUEEN', 'Logo 边饰抽绳拉链束脚卫裤', '8700.0', '15.jpg', '1', '2');
INSERT INTO `goods` VALUES ('16', 'ACNE STUDIOS', '“AS”刺绣落肩连帽卫衣', '3000.0', '16.jpg', '1', '1');
INSERT INTO `goods` VALUES ('17', 'ACNE STUDIOS', '“AS”刺绣落肩圆领卫衣', '2500.0', '17.jpg', '1', '1');
INSERT INTO `goods` VALUES ('18', 'STAMPD', '拼色罗纹抽绳长裤', '1999.0', '18.jpg', '1', '2');
INSERT INTO `goods` VALUES ('19', '424', 'Logo 嵌花袜子边饰运动鞋', '2799.0', '19.jpg', '1', '3');
INSERT INTO `goods` VALUES ('20', 'FEAR OF GOD', '系带高帮运动鞋', '8999.0', '20.jpg', '1', '3');
INSERT INTO `goods` VALUES ('21', '3.1 PHILLIP LIM', '不规则条纹拼色褶饰圆领 T 恤', '2999.0', '21.jpg', '2', '1');
INSERT INTO `goods` VALUES ('22', '3.1 PHILLIP LIM', '荷叶边叠层短裤', '3999.0', '22.jpg', '2', '2');
INSERT INTO `goods` VALUES ('23', 'ALEXANDER MCQUEEN', 'DUTCH MASTERS 印花圆领 T 恤', '2800.0', '23.jpg', '2', '1');
INSERT INTO `goods` VALUES ('24', 'ALEXANDER MCQUEEN', 'Logo 刺绣牛仔半身裙', '6900.0', '24.jpg', '2', '2');
INSERT INTO `goods` VALUES ('25', 'HYSTERIC GLAMOUR', 'Logo 人像印花短袖 T 恤', '1599.0', '25.jpg', '2', '1');
INSERT INTO `goods` VALUES ('26', 'HYSTERIC GLAMOUR', '图案印花钩编细节连衣裙', '3299.0', '26.jpg', '2', '1');
INSERT INTO `goods` VALUES ('27', 'OFF-WHITE c/o VIRGIL ABLOH', '磨边牛仔短裤', '3499.0', '27.jpg', '2', '2');
INSERT INTO `goods` VALUES ('28', 'MSGM', '不规则布料缝饰连衣裙', '2599.0', '28.jpg', '2', '1');
INSERT INTO `goods` VALUES ('29', 'ANN DEMEULEMEESTER', '植物印花不规则无袖 T 恤', '2699.0', '29.jpg', '2', '1');
INSERT INTO `goods` VALUES ('30', 'ANN DEMEULEMEESTER', '高帮系带凉鞋', '5499.0', '30.jpg', '2', '3');
INSERT INTO `goods` VALUES ('31', 'McQ', 'Swallow 缝饰绑带拼接短袖上衣', '2999.0', '31.jpg', '2', '1');
INSERT INTO `goods` VALUES ('32', 'ALEXANDER MCQUEEN', 'Logo 印花拼色皮革运动鞋', '4900.0', '32.jpg', '2', '3');
INSERT INTO `goods` VALUES ('33', '3.1 PHILLIP LIM', '后背开叉打结圆领卫衣', '3799.0', '33.jpg', '2', '1');
INSERT INTO `goods` VALUES ('34', 'UNDERCOVER', '猫咪印花圆领 T 恤', '1299.0', '34.jpg', '2', '1');
INSERT INTO `goods` VALUES ('35', 'ALEXANDER MCQUEEN', '花卉嵌花拼色蕾丝半身裙', '1240.0', '35.jpg', '2', '2');
INSERT INTO `goods` VALUES ('36', 'STELLA McCARTNEY', '配腰带阔腿七分裤', '5800.0', '36.jpg', '2', '2');
INSERT INTO `goods` VALUES ('37', 'STELLA McCARTNEY', 'Stars Elyse 星星缝饰厚底鞋', '6700.0', '37.jpg', '2', '3');
INSERT INTO `goods` VALUES ('38', 'UNDERCOVER', '动物印花两面穿上衣', '4499.0', '38.jpg', '2', '1');
INSERT INTO `goods` VALUES ('39', 'ACNE STUDIOS', 'Logo 装饰落肩连帽卫衣', '3200.0', '39.jpg', '2', '1');
INSERT INTO `goods` VALUES ('40', 'McQ', '飞燕缝饰运动鞋', '1999.0', '40.jpg', '2', '3');
INSERT INTO `goods` VALUES ('41', 'ACNE STUDIOS', '短款水洗牛仔夹克', '3000.0', '41.jpg', '2', '1');
INSERT INTO `goods` VALUES ('42', 'Dreamland Syndicate', '字母动物印花短袖 T 恤', '599.0', '42.jpg', '1', '1');
INSERT INTO `goods` VALUES ('43', 'ALEXANDER MCQUEEN', '迷彩圆领卫衣', '6200.0', '43.jpg', '1', '1');
INSERT INTO `goods` VALUES ('44', 'OFF-WHITE c/o VIRGIL ABLOH', '饰口袋印花迷彩双肩包', '5899.0', '44.jpg', '1', '3');
INSERT INTO `goods` VALUES ('45', 'MSGM', 'Logo 印花双肩包', '5599.0', '45.jpg', '2', '3');

-- ----------------------------
-- Table structure for `shoppingcart`
-- ----------------------------
DROP TABLE IF EXISTS `shoppingcart`;
CREATE TABLE `shoppingcart` (
  `scid` int(5) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8 NOT NULL,
  `goodsid` int(4) NOT NULL,
  `quantity` int(2) DEFAULT NULL,
  PRIMARY KEY (`scid`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of shoppingcart
-- ----------------------------
INSERT INTO `shoppingcart` VALUES ('5', 'kfd', '18', '1');
INSERT INTO `shoppingcart` VALUES ('11', 'leon', '7', '3');
INSERT INTO `shoppingcart` VALUES ('20', 'leon', '23', '2');
INSERT INTO `shoppingcart` VALUES ('21', 'leon', '41', '1');
INSERT INTO `shoppingcart` VALUES ('22', 'kfd', '4', '1');
INSERT INTO `shoppingcart` VALUES ('23', '中文测试', '24', '1');
INSERT INTO `shoppingcart` VALUES ('24', 'qqq', '22', '1');
INSERT INTO `shoppingcart` VALUES ('25', 'qqq', '3', '1');
INSERT INTO `shoppingcart` VALUES ('26', 'qqq', '45', '5');
INSERT INTO `shoppingcart` VALUES ('27', 'kfd', '41', '1');

-- ----------------------------
-- Table structure for `token`
-- ----------------------------
DROP TABLE IF EXISTS `token`;
CREATE TABLE `token` (
  `e_username` varchar(20) CHARACTER SET utf8 NOT NULL,
  `e_usertoken` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`e_username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of token
-- ----------------------------

-- ----------------------------
-- Table structure for `usertable`
-- ----------------------------
DROP TABLE IF EXISTS `usertable`;
CREATE TABLE `usertable` (
  `userid` int(4) NOT NULL AUTO_INCREMENT,
  `e_username` varchar(20) CHARACTER SET utf8 NOT NULL,
  `e_password` varchar(20) NOT NULL,
  `e_email` varchar(30) NOT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of usertable
-- ----------------------------
