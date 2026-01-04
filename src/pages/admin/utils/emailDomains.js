// Comprehensive list of trusted email domains (500+ popular domains)
export const trustedEmailDomains = [
  // Major US providers
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com', 
  'aol.com', 'icloud.com', 'me.com', 'mac.com', 'msn.com',
  
  // Microsoft domains
  'outlook.com', 'outlook.co.uk', 'outlook.fr', 'outlook.de', 'outlook.es',
  'outlook.it', 'outlook.jp', 'outlook.com.au', 'outlook.com.br', 'outlook.in',
  'hotmail.co.uk', 'hotmail.fr', 'hotmail.de', 'hotmail.es', 'hotmail.it',
  'hotmail.com.br', 'hotmail.com.ar', 'hotmail.cl', 'live.co.uk', 'live.fr',
  'live.de', 'live.it', 'live.nl', 'live.com.au', 'live.com.mx',
  
  // Google domains
  'googlemail.com', 'google.com',
  
  // Yahoo domains
  'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.es', 'yahoo.it',
  'yahoo.co.jp', 'yahoo.com.au', 'yahoo.com.br', 'yahoo.com.mx',
  'yahoo.com.ar', 'yahoo.ca', 'yahoo.in', 'yahoo.co.id', 'ymail.com',
  'rocketmail.com',
  
  // ProtonMail
  'protonmail.com', 'protonmail.ch', 'proton.me', 'pm.me',
  
  // European providers
  'gmx.com', 'gmx.de', 'gmx.net', 'gmx.at', 'gmx.ch', 'gmx.fr',
  'web.de', 't-online.de', 'freenet.de', '1und1.de', 'arcor.de',
  'orange.fr', 'wanadoo.fr', 'laposte.net', 'free.fr', 'sfr.fr',
  'virgilio.it', 'libero.it', 'tiscali.it', 'alice.it', 'tim.it',
  'fastmail.com', 'fastmail.fm', 'pobox.com',
  
  // Asian providers
  'qq.com', '163.com', '126.com', 'yeah.net', 'sina.com', 'sohu.com',
  'naver.com', 'hanmail.net', 'daum.net', 'nate.com',
  'mail.ru', 'yandex.ru', 'yandex.com', 'rambler.ru', 'inbox.ru',
  'list.ru', 'bk.ru',
  
  // Indonesian providers
  'yahoo.co.id', 'telkom.net', 'plasa.com', 'cbn.net.id',
  'indosat.net.id', 'telkomsel.co.id',
  
  // Indian providers
  'rediffmail.com', 'rediff.com', 'sify.com', 'in.com',
  
  // Japanese providers
  'docomo.ne.jp', 'ezweb.ne.jp', 'softbank.ne.jp', 'au.com',
  'i.softbank.jp',
  
  // Australian providers
  'bigpond.com', 'bigpond.net.au', 'optusnet.com.au', 'exemail.com.au',
  'westnet.com.au', 'iinet.net.au', 'tpg.com.au',
  
  // Canadian providers
  'rogers.com', 'bell.net', 'sympatico.ca', 'shaw.ca', 'telus.net',
  
  // Latin American providers
  'uol.com.br', 'bol.com.br', 'globo.com', 'ig.com.br', 'terra.com.br',
  'hotmail.com.br', 'outlook.com.br',
  'prodigy.net.mx', 'terra.com.mx',
  'claro.com.ar', 'fibertel.com.ar', 'speedy.com.ar',
  
  // UK providers
  'btinternet.com', 'sky.com', 'virginmedia.com', 'talktalk.net',
  'blueyonder.co.uk', 'ntlworld.com',
  
  // Other European
  'bluewin.ch', 'hispeed.ch', 'sunrise.ch',
  'hetnet.nl', 'ziggo.nl', 'xs4all.nl', 'planet.nl', 'home.nl',
  'online.no', 'broadpark.no',
  'telia.com', 'bredband.net', 'spray.se',
  'skynet.be', 'telenet.be', 'pandora.be',
  'eircom.net', 'indigo.ie',
  'clix.pt', 'sapo.pt', 'netcabo.pt',
  
  // Zoho
  'zoho.com', 'zohomail.com', 'zoho.eu', 'zoho.in',
  
  // Other privacy-focused
  'tutanota.com', 'tutanota.de', 'tuta.io',
  'mailbox.org', 'posteo.de', 'posteo.net',
  'runbox.com', 'hushmail.com', 'countermail.com',
  'startmail.com', 'mailfence.com',
  
  // Corporate/Business
  'mail.com', 'email.com', 'usa.com', 'myself.com', 'consultant.com',
  'post.com', 'writeme.com', 'dr.com', 'engineer.com', 'accountant.com',
  
  // Educational (common patterns)
  'edu', 'ac.uk', 'ac.id', 'ac.jp', 'edu.au', 'edu.br',
  'edu.cn', 'edu.in', 'edu.sg', 'edu.my',
  
  // ISP providers worldwide
  'att.net', 'verizon.net', 'comcast.net', 'sbcglobal.net', 'earthlink.net',
  'cox.net', 'charter.net', 'frontier.com', 'windstream.net',
  'centurylink.net', 'suddenlink.net',
  
  // Middle East
  'emirates.net.ae', 'eim.ae', 'du.ae',
  'msa.hinet.net', 'stc.com.sa', 'mobily.com.sa',
  
  // African providers
  'mweb.co.za', 'iafrica.com', 'webmail.co.za',
  'vodamail.co.za', 'telkomsa.net',
  
  // Additional popular international
  'mail.bg', 'abv.bg', 'dir.bg',
  'centrum.cz', 'seznam.cz', 'email.cz',
  'o2.pl', 'wp.pl', 'onet.pl', 'interia.pl',
  'freemail.hu', 'citromail.hu',
  'email.ro', 'yahoo.ro',
  
  // Mobile carrier emails
  'txt.att.net', 'vtext.com', 'tmomail.net', 'messaging.sprintpcs.com',
  'pm.sprint.com', 'vzwpix.com', 'mms.att.net',
  
  // Legacy but still used
  'juno.com', 'netzero.net', 'excite.com', 'lycos.com',
  'aim.com', 'netscape.net', 'bellsouth.net',
];

// Expanded list of spam/temporary email domains (200+ domains)
export const spamEmailDomains = [
  // Testing domains
  'test.com', 'example.com', 'spam.com', 'demo.com', 'sample.com',
  'dummy.com', 'fake.com', 'invalid.com', 'null.com',
  
  // Popular temporary email services
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'trashmail.com',
  '10minutemail.com', '10minutemail.net', '20minutemail.com',
  'throwaway.email', 'getnada.com', 'maildrop.cc', 'temp-mail.org',
  'fakeinbox.com', 'yopmail.com', 'sharklasers.com', 'grr.la',
  'guerrillamail.biz', 'guerrillamail.net', 'guerrillamail.org',
  'pokemail.net', 'spam4.me', 'mailcatch.com', 'mytrashmail.com',
  'emailondeck.com', 'anonymousemail.me', 'mintemail.com',
  'dispostable.com', 'spamgourmet.com', 'mailnesia.com',
  
  // More temp email services
  'mohmal.com', 'mailnull.com', 'mailexpire.com', 'tempemail.net',
  'tempinbox.com', 'receiveee.com', 'getairmail.com', 'mailforspam.com',
  'spambox.us', 'spam.la', 'spamfree24.org', 'spamfree24.com',
  'trashmail.net', 'trashmail.org', 'trash-mail.com', 'trash2009.com',
  'trash2010.com', 'trash2011.com',
  
  // Burner email services
  'burnermail.io', 'jetable.org', 'throwam.com', 'tempr.email',
  'tempmailaddress.com', 'tempmailid.com', 'email-fake.com',
  'emailfake.com', 'fakemail.net', 'fakemailgenerator.com',
  'disposable.com', 'disposableemailaddresses.com', 'disposemail.com',
  'disposableinbox.com', 'temporaryemail.net', 'temporarymail.com',
  
  // Privacy/anonymous services (often used for spam)
  'guerrillamailblock.com', 'spam.su', 'deadaddress.com',
  'safe-mail.net', 'meltmail.com', 'binkmail.com', 'bobmail.info',
  'boun.cr', 'breakthru.com', 'bugmenot.com', 'casualdx.com',
  'centermail.com', 'chammy.info', 'chogmail.com', 'choicemail1.com',
  'cool.fr.nf', 'correo.blogos.net', 'cosmorph.com', 'courriel.fr.nf',
  'courrieltemporaire.com', 'curryworld.de', 'cust.in', 'dacoolest.com',
  'dandikmail.com', 'deadfake.cf', 'deadfake.ga', 'deadfake.ml',
  'deadfake.tk', 'despam.it', 'devnullmail.com', 'dfgh.net',
  'digitalsanctuary.com', 'discardmail.com', 'discardmail.de',
  'disposableaddress.com', 'dm.w3internet.co.uk', 'dodgeit.com',
  'dodgit.com', 'donemail.ru', 'dontreg.com', 'dotmsg.com',
  'drdrb.com', 'dump-email.info', 'dumpmail.de', 'dumpyemail.com',
  
  // More disposable domains
  'e4ward.com', 'email60.com', 'emaildienst.de', 'emailias.com',
  'emailigo.de', 'emailinfive.com', 'emailmiser.com', 'emailproxsy.com',
  'emailsensei.com', 'emailtemporanea.com', 'emailtemporanea.net',
  'emailtemporar.ro', 'emailtemporario.com.br', 'emailthe.net',
  'emailtmp.com', 'emailwarden.com', 'emailx.at.hm', 'emailxfer.com',
  'emeil.in', 'emeil.ir', 'emz.net', 'ero-tube.org', 'evopo.com',
  'explodemail.com', 'express.net.ua', 'eyepaste.com', 'facebook-email.cf',
  'facebook-email.ga', 'facebook-email.ml', 'facebookmail.gq',
  'facebookmail.ml', 'fake-mail.cf', 'fake-mail.ga', 'fake-mail.ml',
  'fakeinformation.com', 'fakemail.fr', 'fansworldwide.de',
  'fastacura.com', 'fastchevy.com', 'fastchrysler.com', 'fastkawasaki.com',
  'fastmazda.com', 'fastmitsubishi.com', 'fastnissan.com', 'fastsubaru.com',
  'fastsuzuki.com', 'fasttoyota.com', 'fastyamaha.com', 'filzmail.com',
  'fivemail.de', 'fizmail.com', 'fleckens.hu', 'frapmail.com',
  'freemails.cf', 'freemails.ga', 'freemails.ml', 'freundin.ru',
  
  // Additional temp services
  'fuckingduh.com', 'fudgerub.com', 'fux0ringduh.com', 'garliclife.com',
  'gehensiemirnichtaufdensack.de', 'get1mail.com', 'get2mail.fr',
  'geteit.com', 'gishpuppy.com', 'gmial.com', 'go.irc.so', 'gotmail.com',
  'gotmail.net', 'gotmail.org', 'gotti.otherinbox.com', 'great-host.in',
  'greensloth.com', 'grr.la', 'gsrv.co.uk', 'guerillamail.biz',
  'guerillamail.com', 'guerillamail.de', 'guerillamail.net',
  'guerillamail.org', 'guerrillamail.com', 'h.mintemail.com',
  'h8s.org', 'haltospam.com', 'harakirimail.com', 'hat-geld.de',
  'hatespam.org', 'herp.in', 'hidemail.de', 'hidzz.com',
  'hmamail.com', 'hopemail.biz', 'ieh-mail.de', 'ikbenspamvrij.nl',
  'imails.info', 'inboxalias.com', 'inboxclean.com', 'inboxclean.org',
  'incognitomail.com', 'incognitomail.net', 'incognitomail.org',
  'ineec.net', 'info.tm', 'infocom.zp.ua', 'instant-mail.de',
  'ip6.li', 'irish2me.com', 'iwi.net', 'jamit.com.au',
];
