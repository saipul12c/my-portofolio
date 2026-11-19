const fs = require('fs');
const path = require('path');

const imgDir = path.resolve(__dirname, '../src/assets/images');
const files = fs.readdirSync(imgDir);

function readExif(buf) {
  try {
    const tiffStart = 12;
    if (buf.length < 30 || buf[0] !== 0xFF || buf[1] !== 0xD8) return null;
    const isLE = buf[tiffStart] === 0x49;
    const r16 = (o) => isLE ? buf.readUInt16LE(o) : buf.readUInt16BE(o);
    const r32 = (o) => isLE ? buf.readUInt32LE(o) : buf.readUInt32BE(o);

    const ifd0 = tiffStart + r32(tiffStart + 4);
    const entries = r16(ifd0);
    const result = {};

    let exifSubIFD = 0;
    for (let i = 0; i < entries; i++) {
      const o = ifd0 + 2 + i * 12;
      const tag = r16(o);
      const count = r32(o + 4);
      const valOff = tiffStart + r32(o + 8);
      if (tag === 0x0110) result.model = buf.toString('ascii', valOff, valOff + count - 1).trim();
      if (tag === 0x0132) result.dateTime = buf.toString('ascii', valOff, valOff + count - 1).trim();
      if (tag === 0x8769) exifSubIFD = tiffStart + r32(o + 8);
    }

    if (exifSubIFD && exifSubIFD < buf.length - 2) {
      const subEntries = r16(exifSubIFD);
      for (let i = 0; i < subEntries; i++) {
        const o = exifSubIFD + 2 + i * 12;
        if (o + 12 > buf.length) break;
        const tag = r16(o);
        const count = r32(o + 4);
        const valOff = tiffStart + r32(o + 8);
        if (tag === 0x829a && valOff + 8 <= buf.length) {
          const num = r32(valOff), den = r32(valOff + 4);
          result.shutter_speed = num === 1 ? '1/' + den + 's' : (num / den).toFixed(2) + 's';
        }
        if (tag === 0x829d && valOff + 8 <= buf.length) {
          const num = r32(valOff), den = r32(valOff + 4);
          result.aperture = 'f/' + (num / den).toFixed(1);
        }
        if (tag === 0x8827) result.iso = r16(o + 8);
        if (tag === 0x920a && valOff + 8 <= buf.length) {
          const num = r32(valOff), den = r32(valOff + 4);
          result.focal_length = Math.round(num / den) + 'mm';
        }
        if (tag === 0xa434 && valOff + count <= buf.length) {
          result.lens = buf.toString('ascii', valOff, valOff + count - 1).trim();
        }
      }
    }
    return result;
  } catch (e) {
    return null;
  }
}

const sortedFiles = [...files].sort((a, b) => {
  if (a.startsWith('5R x12')) return -1;
  if (b.startsWith('5R x12')) return 1;
  const aEdit = a.includes('SimpleEdit');
  const bEdit = b.includes('SimpleEdit');
  if (aEdit && !bEdit) return -1;
  if (!aEdit && bEdit) return 1;
  return a.localeCompare(b);
});

const photosPath = path.resolve(__dirname, '../src/data/foto/photos.json');
const rawPhotos = fs.existsSync(photosPath) ? JSON.parse(fs.readFileSync(photosPath, 'utf8')) : [];
// Hanya pertahankan data dummy jika id <= 100
const existingPhotos = rawPhotos.filter(p => p.id <= 100);

const titles = [
  'Harmoni Kebersamaan', 'Tawa Hangat Studio', 'Sahabat Seirama', 'Momen Penuh Cerita',
  'Energi & Senyuman', 'Karakter & Chemistry', 'Sudut Kenangan', 'Kebersamaan Nyata',
  'Sorot Ceria Sahabat', 'Gaya & Kekompakan', 'Kisah Satu Frame', 'Hangatnya Persahabatan',
  'Sentuhan Kasual Elegan', 'Kompak & Berwarna', 'Senyum Tanpa Batas', 'Langkah Bersama',
  'Irama Kebersamaan', 'Detik Berharga', 'Kehangatan Tim', 'Visual Kenangan Indah'
];

const newPhotos = sortedFiles.map((filename, index) => {
  const buf = fs.readFileSync(path.join(imgDir, filename));
  const exif = readExif(buf) || {};
  const id = 101 + index;
  
  const is5R = filename.startsWith('5R x12');
  const isCopy = filename.includes('copy');
  const isSimpleEdit = filename.includes('SimpleEdit');
  const matchNum = filename.match(/\d{4}/);
  const numStr = matchNum ? matchNum[0] : '';
  
  let title = '';
  let description = '';
  let category = 'Studio Portrait';
  let mood = 'Ceria, Hangat';
  let color_palette = ['#F5F5F7', '#D4B996', '#2C3038'];
  
  if (is5R) {
    title = 'Koleksi Cetak 5R Kenangan Bersama (12 Frame)';
    description = 'Kompilasi frame cetak 5R momen seru dan penuh kehangatan bersama sahabat di studio foto.';
    category = 'Studio Portrait';
    mood = 'Hangat, Ceria, Nostalgik';
    color_palette = ['#F5F5F7', '#D4B996', '#4A5568'];
  } else if (isCopy) {
    title = 'Studio Portrait #5580 (Special Variant)';
    description = 'Varian pose studio #5580 dengan komposisi sudut menarik dan pencahayaan studio yang lembut.';
    category = 'Creative';
    mood = 'Modern, Dinamis';
    color_palette = ['#1E293B', '#8A94A6', '#F1F5F9'];
  } else if (isSimpleEdit) {
    const baseTitle = titles[index % titles.length];
    title = `${baseTitle} #${numStr} (Edit)`;
    description = `Potret studio sahabat #${numStr} dengan sentuhan color grading hangat, menonjolkan ekspresi ceria dan kebersamaan natural.`;
    category = index % 2 === 0 ? 'Studio Portrait' : 'Editorial';
    mood = 'Hangat, Ceria, Elegan';
    color_palette = ['#F5F5F7', '#D4B996', '#2C3038'];
  } else {
    const baseTitle = titles[index % titles.length];
    title = `${baseTitle} #${numStr} (Original)`;
    description = `Tangkapan orisinal kamera Canon EOS RP #${numStr} yang mengabadikan momen spontan dan chemistry akrab di studio.`;
    category = index % 3 === 0 ? 'Group Portrait' : (index % 3 === 1 ? 'Studio Portrait' : 'Creative');
    mood = 'Akrab, Alami, Sinematik';
    color_palette = ['#2C3038', '#8A94A6', '#E5E9F0'];
  }

  let dateTaken = '2026-11-07';
  if (exif.dateTime) {
    const parts = exif.dateTime.split(' ')[0].replace(/:/g, '-');
    if (parts) dateTaken = parts;
  }

  return {
    id,
    title,
    description,
    img: `/assets/images/${encodeURI(filename)}`,
    category,
    location: 'Studio Foto, Indonesia',
    date_taken: dateTaken,
    camera: exif.model || 'Canon EOS RP',
    lens: exif.lens || 'RF24-105mm F4-7.1 IS STM',
    focal_length: exif.focal_length || '46mm',
    aperture: exif.aperture || 'f/5.6',
    shutter_speed: exif.shutter_speed || '1/100s',
    iso: exif.iso || 400,
    color_palette,
    mood
  };
});

// Simpan ke photos.json (letakkan 114 foto baru di awal)
const allPhotos = [...newPhotos, ...existingPhotos];
fs.writeFileSync(photosPath, JSON.stringify(allPhotos, null, 2), 'utf8');
console.log('✅ Updated photos.json with', allPhotos.length, 'photos total (', newPhotos.length, 'new from src/assets/images)');

// Update albums.json
const albumsPath = path.resolve(__dirname, '../src/data/gallery/albums.json');
const rawAlbums = fs.existsSync(albumsPath) ? JSON.parse(fs.readFileSync(albumsPath, 'utf8')) : [];
const existingAlbums = rawAlbums.filter(a => a.id < 1000);

const simpleEditPhotos = newPhotos.filter(p => p.img.includes('SimpleEdit') || p.img.includes('5R')).map(p => p.img);
const originalPhotos = newPhotos.filter(p => !p.img.includes('SimpleEdit') && !p.img.includes('5R')).map(p => p.img);

const newAlbums = [
  {
    id: 1001,
    type: 'album',
    title: 'Koleksi Studio Eksklusif (SimpleEdit Edition)',
    desc: 'Koleksi pilihan 57 potret studio versi color-graded dengan nuansa hangat, elegan, dan penuh ekspresi tawa sahabat.',
    category: 'Studio Portrait',
    src: simpleEditPhotos,
    tags: ['studio', 'portrait', 'sahabat', 'kebersamaan', 'album', 'simpleedit'],
    uploaded_at: '2026-11-07T16:00:00Z',
    creator: {
      username: 'syaiful_m',
      display_name: 'Muhammad Syaiful Mukmin',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      verified: true,
      followers: 8720,
      bio: 'Fotografer & Full Stack Developer 📸',
      joined_at: '2020-06-20T00:00:00Z',
      social_links: {
        instagram: 'https://instagram.com/saipul16_',
        facebook: 'https://facebook.com/syaiful.mukmin'
      }
    },
    details: {
      camera: 'Canon EOS RP',
      lens: 'RF24-105mm F4-7.1 IS STM',
      location: {
        name: 'Studio Foto',
        city: 'Jakarta',
        country: 'Indonesia'
      },
      aspect_ratio: '3:2',
      mood: ['ceria', 'hangat', 'kebersamaan', 'elegan']
    },
    engagement: {
      views: 18450,
      likes: 4210,
      comments: 68,
      shares: 34,
      saves: 152
    }
  },
  {
    id: 1002,
    type: 'album',
    title: 'Dokumentasi Lengkap Photoshoot Canon EOS RP',
    desc: 'Dokumentasi lengkap seluruh 56 bidikan orisinal resolusi tinggi dari sesi photoshoot studio bersama sahabat.',
    category: 'Group Portrait',
    src: originalPhotos,
    tags: ['studio', 'group', 'canon', 'original', 'photoshoot', 'memories'],
    uploaded_at: '2026-11-07T15:45:00Z',
    creator: {
      username: 'syaiful_m',
      display_name: 'Muhammad Syaiful Mukmin',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      verified: true,
      followers: 8720,
      bio: 'Fotografer & Full Stack Developer 📸',
      joined_at: '2020-06-20T00:00:00Z',
      social_links: {
        instagram: 'https://instagram.com/saipul16_',
        facebook: 'https://facebook.com/syaiful.mukmin'
      }
    },
    details: {
      camera: 'Canon EOS RP',
      lens: 'RF24-105mm F4-7.1 IS STM',
      location: {
        name: 'Studio Foto',
        city: 'Jakarta',
        country: 'Indonesia'
      },
      aspect_ratio: '3:2',
      mood: ['akrab', 'alami', 'sinematik']
    },
    engagement: {
      views: 14200,
      likes: 3580,
      comments: 42,
      shares: 28,
      saves: 118
    }
  }
];

const allAlbums = [...newAlbums, ...existingAlbums];
fs.writeFileSync(albumsPath, JSON.stringify(allAlbums, null, 2), 'utf8');
console.log('✅ Updated albums.json with', allAlbums.length, 'albums total');

// Update galleryData.json (untuk preview di Home.jsx)
const galleryDataPath = path.resolve(__dirname, '../src/data/galleryData.json');
const rawGalleryData = fs.existsSync(galleryDataPath) ? JSON.parse(fs.readFileSync(galleryDataPath, 'utf8')) : [];
const existingGalleryData = rawGalleryData.filter(g => g.id < 1000);

const homeTopItems = newPhotos.slice(0, 6).map((p, idx) => ({
  id: 1001 + idx,
  type: 'image',
  title: p.title,
  desc: p.description,
  src: p.img,
  category: p.category,
  tags: ['studio', 'portrait', 'sahabat'],
  uploaded_at: '2026-11-07',
  creator: 'Muhammad Syaiful Mukmin',
  details: {
    camera: p.camera,
    location: 'Studio Foto, Indonesia'
  }
}));
const allGalleryData = [...homeTopItems, ...existingGalleryData];
fs.writeFileSync(galleryDataPath, JSON.stringify(allGalleryData, null, 2), 'utf8');
console.log('✅ Updated galleryData.json with', allGalleryData.length, 'items');
