---
title: Hackintosh El Capitan on hp-probook 440 g3
tags: hardware
image: /assets/img/img-news.png
share-img: /assets/img/img-news_md.png
thumbnail-img: /assets/img/img-news_sm.png
excerpt: I have just finished to install OSX 10.11 on my HP probook
---

I have just finished to install OSX 10.11 (El Capitan) on my HP notebook.

It works! Almost :) currently: WiFi not available

Hardware specs:

+ _Product code_: P5T15EA#ABZ
+ _Model_: HP ProBook 440 G3
+ _CPU_: Intel Core i5-6200U
+ _GPU_: Intel HD 520
+ _RAM_: 8Gb DDR3L-1600
+ _SSD_: 256 Gb
+ _Display_: FullHD
+ _Ethernet_: Realtek
+ _Wireless_: Intel Dual Band Wireless-AC 3165 802.11a/b/g/n/ac WiFi + Bluetooth 4.0

Links used:

+ [http://www.tonymacx86.com/threads/guide-hp-probook-elitebook-zbook-using-clover-uefi-hotpatch-10-11.189416/](http://www.tonymacx86.com/threads/guide-hp-probook-elitebook-zbook-using-clover-uefi-hotpatch-10-11.189416/)
+ [http://www.tonymacx86.com/threads/guide-booting-the-os-x-installer-on-laptops-with-clover.148093/](http://www.tonymacx86.com/threads/guide-booting-the-os-x-installer-on-laptops-with-clover.148093/)

Notes:

+ _Installer_: FAT32 partition (for Clover) and HFS+J partition (for OSX) - Clover UEFI using MBR
+ _Config_: config_HD520_530_540.plist
+ _kexts_: GenericUSBXHCI.kext, RealtekRTL8111.kext, FakeSMC.kext, SATA-100-series-unsupported.kext, VoodooPS2Controller.kext (not others Fake plugins because they were causing reboots during USB boot)
+ _BIOS_: video memory 64 Mb, legacy ON, secure boot OFF
+ _post-install_: copied EFI contents from USB to boot drive hidden EFI path (after mounted it) (to boot directly from SSD)

Update:

Searching online it seems that my wifi adapter can't actually work with Hackintosh. I solved the problem using a mini USB WiFi adapter (Ralink RT5370)

![screenshot](/assets/img/screenshot-hackintosh-el-capitan-on-hp-probook-440-g3.jpg)
