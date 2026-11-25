#!/usr/bin/env node

/**
 * SaipulAI CLI (Command Line Interface)
 * Universal Terminal Client & Interactive REPL
 * Version: 8.0.0
 * 
 * Penggunaan:
 *   npm run cli
 *   node bin/saipul-cli.js
 *   node bin/saipul-cli.js "hitung 2x + 10 = 20"
 *   node bin/saipul-cli.js --file ./data.csv "analisis data ini"
 *   echo "hitung rata-rata 10, 20, 30" | node bin/saipul-cli.js
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { generateResponse } from '../api/saipul.js';

// ANSI Colors untuk Terminal UI yang Indah
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  // Foreground Colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  // Bright Colors
  brightCyan: '\x1b[96m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m'
};

const VERSION = "8.0.0";

const BANNER = `
${C.cyan}${C.bold} ███████╗ █████╗ ██╗██████╗ ██╗   ██╗██╗      █████╗ ██╗
 ██╔════╝██╔══██╗██║██╔══██╗██║   ██║██║     ██╔══██╗██║
 ███████╗███████║██║██████╔╝██║   ██║██║     ███████║██║
 ╚════██║██╔══██║██║██╔═══╝ ██║   ██║██║     ██╔══██║██║
 ███████║██║  ██║██║██║     ╚██████╔╝███████╗██║  ██║██║
 ╚══════╝╚═╝  ╚═╝╚═╝╚═╝      ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝${C.reset}
     ${C.brightYellow}⚡ Terminal Intelligence & Harmonized Cognitive Engine v${VERSION}${C.reset}
     ${C.dim}Terhubung dengan Universal Knowledge Base, smartKBQuery & Deep Neural Pipeline.${C.reset}
     ${C.dim}Ketik pertanyaan atau ketik ${C.bold}/help${C.dim} untuk panduan. Ketik ${C.bold}/exit${C.dim} untuk keluar.${C.reset}
`;

// Parsing Argument CLI
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    query: '',
    style: 'friendly',
    json: false,
    stream: false,
    file: null,
    help: false,
    version: false
  };

  const positional = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '-v' || arg === '--version') {
      options.version = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--stream') {
      options.stream = true;
    } else if (arg === '-s' || arg === '--style') {
      options.style = args[++i] || 'friendly';
    } else if (arg === '-f' || arg === '--file') {
      options.file = args[++i] || null;
    } else if (arg.startsWith('--style=')) {
      options.style = arg.split('=')[1] || 'friendly';
    } else if (arg.startsWith('--file=')) {
      options.file = arg.split('=')[1] || null;
    } else {
      positional.push(arg);
    }
  }

  options.query = positional.join(' ').trim();
  return options;
}

function showHelp() {
  console.log(`
${C.cyan}${C.bold}SaipulAI CLI v${VERSION}${C.reset}
Penggunaan:
  ${C.green}saipul-cli${C.reset} [pilihan] [pertanyaan]

Pilihan:
  ${C.yellow}-h, --help${C.reset}          Tampilkan panduan bantuan ini
  ${C.yellow}-v, --version${C.reset}       Tampilkan versi SaipulAI CLI
  ${C.yellow}-s, --style <gaya>${C.reset}  Gaya bahasa ('friendly' | 'formal' | 'concise')
  ${C.yellow}-f, --file <berkas>${C.reset} Baca isi berkas (CSV, JSON, TXT) untuk dianalisis
  ${C.yellow}--stream${C.reset}            Aktifkan efek typewriter streaming secara langsung
  ${C.yellow}--json${C.reset}              Keluarkan output dalam format JSON mentah

Perintah Cepat di REPL Mode:
  ${C.cyan}/help${C.reset}               Tampilkan panduan perintah CLI
  ${C.cyan}/clear${C.reset}              Bersihkan layar terminal & reset memori obrolan
  ${C.cyan}/history${C.reset}            Tampilkan riwayat percakapan sesi saat ini
  ${C.cyan}/stats${C.reset}              Lihat statistik dan analitik sesi obrolan
  ${C.cyan}/style <gaya>${C.reset}       Ubah gaya bahasa secara dinamis
  ${C.cyan}/file <path>${C.reset}        Muat dokumen untuk dianalisis secara instan
  ${C.cyan}/exit, /quit${C.reset}        Keluar dari SaipulAI CLI

Contoh Eksekusi:
  ${C.dim}# 1. Mode Interaktif REPL:${C.reset}
  npm run cli

  ${C.dim}# 2. Pertanyaan Matematika Lanjutan Langsung:${C.reset}
  node bin/saipul-cli.js "selesaikan x^2 - 5x + 6 = 0"

  ${C.dim}# 3. Analisis Statistik Deterministik:${C.reset}
  node bin/saipul-cli.js "hitung rata-rata dari 80, 85, 90, 95"

  ${C.dim}# 4. Melalui Stdin Pipe:${C.reset}
  echo "prediksi harga emas" | node bin/saipul-cli.js
`);
}

/**
 * Format badge warna berdasarkan metadata respons
 */
function renderBadges(res) {
  const parts = [];

  if (res.intent) {
    parts.push(`${C.bgBlue || C.blue}[Intent: ${res.intent}]${C.reset}`);
  }

  if (res.source) {
    const srcType = typeof res.source === 'string' ? res.source : (res.source.type || 'kb');
    parts.push(`${C.brightGreen}[Sumber: ${srcType}]${C.reset}`);
  }

  if (typeof res.confidence === 'number' && res.confidence > 0) {
    parts.push(`${C.gray}[Akurasi: ${Math.round(res.confidence * 100)}%]${C.reset}`);
  }

  if (res.sentiment) {
    const val = res.sentiment.sentiment || res.sentiment;
    const color = val === 'positive' ? C.green : val === 'negative' ? C.red : C.gray;
    parts.push(`${color}[Sentimen: ${val}]${C.reset}`);
  }

  if (res.sarcasm && res.sarcasm.isSarcastic) {
    parts.push(`${C.magenta}[🎭 Sarkasme Terdeteksi]${C.reset}`);
  }

  if (res.emotion) {
    const emo = typeof res.emotion === 'string' ? res.emotion : (res.emotion.emotion || 'neutral');
    if (emo && emo !== 'neutral') {
      parts.push(`${C.yellow}[Emosi: ${emo}]${C.reset}`);
    }
  }

  if (res.math && res.math.isMath) {
    parts.push(`${C.brightCyan}[🧮 ${res.math.operation || 'Matematika'}]${C.reset}`);
  }

  return parts.length > 0 ? `${C.dim}── ${parts.join(' ')} ──${C.reset}\n` : '';
}

/**
 * Cetak output respons bot secara rapi di terminal
 */
function printBotResponse(res, asJson = false) {
  if (asJson) {
    console.log(JSON.stringify(res, null, 2));
    return;
  }

  console.log();
  const badges = renderBadges(res);
  if (badges) console.log(badges);

  console.log(`${C.brightCyan}${C.bold}🤖 SaipulAI:${C.reset}`);
  console.log(res.reply);
  console.log();
}

/**
 * Cetak respons bot dengan efek typewriter streaming kata-per-kata di terminal
 */
async function printStreamingBotResponse(res, asJson = false) {
  if (asJson) {
    console.log(JSON.stringify(res, null, 2));
    return;
  }

  console.log();
  const badges = renderBadges(res);
  if (badges) console.log(badges);

  console.log(`${C.brightCyan}${C.bold}🤖 SaipulAI:${C.reset}`);
  
  const replyText = String(res.reply || '');
  const tokens = replyText.split(/(\s+)/);

  for (const token of tokens) {
    process.stdout.write(token);
    if (token.trim().length > 0) {
      let delay = 12;
      if (/[.!?]$/.test(token)) delay = 50;
      else if (/[,;:]$/.test(token)) delay = 25;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  console.log('\n');
}

/**
 * Jalankan interaktif REPL
 */
function startInteractiveRepl(initialStyle = 'friendly') {
  console.clear();
  console.log(BANNER);

  let currentStyle = initialStyle;
  const history = [];
  let turnCount = 0;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${C.cyan}${C.bold}SaipulAI${C.reset} ${C.green}❯${C.reset} `
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();

    if (!input) {
      rl.prompt();
      return;
    }

    // Tangani Slash Commands
    if (input.startsWith('/')) {
      const parts = input.split(' ');
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ').trim();

      switch (cmd) {
        case '/exit':
        case '/quit':
        case '/q':
          console.log(`\n${C.yellow}👋 Terima kasih telah berdiskusi dengan SaipulAI. Sampai jumpa lagi!${C.reset}\n`);
          process.exit(0);
          break;

        case '/clear':
        case '/cls':
          console.clear();
          console.log(BANNER);
          history.length = 0;
          turnCount = 0;
          console.log(`${C.green}✨ Layar dibersihkan dan memori percakapan telah direset.${C.reset}\n`);
          rl.prompt();
          return;

        case '/history':
          console.log(`\n${C.bold}📜 Riwayat Percakapan Sesi (${history.length} pesan):${C.reset}`);
          if (history.length === 0) {
            console.log(`${C.dim}Belum ada percakapan dalam sesi ini.${C.reset}\n`);
          } else {
            history.forEach((h, idx) => {
              const prefix = h.role === 'user' ? `${C.green}Pengguna` : `${C.cyan}SaipulAI`;
              console.log(`${C.dim}[${idx + 1}]${C.reset} ${prefix}:${C.reset} ${h.content}`);
            });
            console.log();
          }
          rl.prompt();
          return;

        case '/stats':
          console.log(`\n${C.bold}📊 Statistik Sesi Obrolan:${C.reset}`);
          console.log(`• Total Turn: ${turnCount}`);
          console.log(`• Riwayat Pesan: ${history.length}`);
          console.log(`• Gaya Bahasa Aktif: ${C.cyan}${currentStyle}${C.reset}\n`);
          rl.prompt();
          return;

        case '/style':
          if (arg) {
            currentStyle = arg;
            console.log(`${C.green}Gaya respons diubah menjadi: ${C.bold}${currentStyle}${C.reset}\n`);
          } else {
            console.log(`${C.yellow}Gaya saat ini: ${currentStyle}. Pilihan: friendly, formal, concise, technical.${C.reset}\n`);
          }
          rl.prompt();
          return;

        case '/file':
          if (!arg) {
            console.log(`${C.red}Sertakan path file. Contoh: /file ./laporan.csv${C.reset}\n`);
            rl.prompt();
            return;
          }
          try {
            const filePath = path.resolve(process.cwd(), arg);
            if (!fs.existsSync(filePath)) {
              console.log(`${C.red}File tidak ditemukan: ${filePath}${C.reset}\n`);
              rl.prompt();
              return;
            }
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            console.log(`${C.green}📁 Berkas ${path.basename(filePath)} (${fileContent.length} bytes) berhasil dimuat.${C.reset}`);

            // Analisis otomatis berkas
            const analysisQuery = `analisis data dari berkas ${path.basename(filePath)}:\n${fileContent.slice(0, 3000)}`;
            const res = generateResponse(analysisQuery, { style: currentStyle, history });
            await printStreamingBotResponse(res);
            history.push({ role: 'user', content: `[Muat File: ${path.basename(filePath)}]` });
            history.push({ role: 'assistant', content: res.reply });
            turnCount++;
          } catch (err) {
            console.log(`${C.red}Gagal membaca file: ${err.message}${C.reset}\n`);
          }
          rl.prompt();
          return;

        case '/help':
        default:
          console.log(`
${C.bold}Panduan Perintah SaipulAI CLI:${C.reset}
  ${C.cyan}/clear${C.reset}       Bersihkan layar & reset memori obrolan
  ${C.cyan}/history${C.reset}     Lihat riwayat percakapan sesi
  ${C.cyan}/stats${C.reset}       Tampilkan metrik dan analitik sesi
  ${C.cyan}/style <gaya>${C.reset} Ubah nada bahasa (friendly/formal/concise)
  ${C.cyan}/file <path>${C.reset}  Muat dan analisis dokumen tabel/teks
  ${C.cyan}/help${C.reset}        Tampilkan menu bantuan ini
  ${C.cyan}/exit${C.reset}        Keluar dari CLI
`);
          rl.prompt();
          return;
      }
    }

    // Proses Kueri Pengguna Normal
    turnCount++;
    const res = generateResponse(input, { style: currentStyle, history });
    await printStreamingBotResponse(res);

    // Simpan ke riwayat percakapan untuk konteks multi-turn
    history.push({ role: 'user', content: input });
    history.push({ role: 'assistant', content: res.reply });

    // Batasi riwayat 20 pesan terakhir agar memori tetap ringan
    if (history.length > 20) {
      history.splice(0, 2);
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log(`\n${C.yellow}👋 Sesi SaipulAI CLI selesai.${C.reset}\n`);
    process.exit(0);
  });
}

/**
 * Titik Masuk Utama CLI (Main Entry Point)
 */
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (options.version) {
    console.log(`SaipulAI CLI  v${VERSION}`);
    process.exit(0);
  }

  // 1. Cek apakah ada input via stdin pipe (misal: echo "..." | saipul-cli)
  if (!process.stdin.isTTY && !options.query) {
    let pipedData = '';
    process.stdin.setEncoding('utf-8');
    for await (const chunk of process.stdin) {
      pipedData += chunk;
    }
    const cleanInput = pipedData.trim();
    if (cleanInput) {
      const res = generateResponse(cleanInput, { style: options.style });
      printBotResponse(res, options.json);
      process.exit(0);
    }
  }

  // 2. Mode One-Shot (Pertanyaan langsung dari argumen CLI)
  if (options.query) {
    let finalQuery = options.query;

    // Jika ada opsi --file, gabungkan konten file ke kueri
    if (options.file) {
      try {
        const filePath = path.resolve(process.cwd(), options.file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          finalQuery = `${options.query}\n\n[Data Berkas: ${path.basename(filePath)}]\n${content}`;
        } else {
          console.error(`${C.red}Error: Berkas tidak ditemukan: ${filePath}${C.reset}`);
          process.exit(1);
        }
      } catch (err) {
        console.error(`${C.red}Gagal membaca berkas: ${err.message}${C.reset}`);
        process.exit(1);
      }
    }

    const res = generateResponse(finalQuery, { style: options.style });
    if (options.stream) {
      await printStreamingBotResponse(res, options.json);
    } else {
      printBotResponse(res, options.json);
    }
    process.exit(0);
  }

  // 3. Mode Interaktif REPL
  startInteractiveRepl(options.style);
}

main().catch(err => {
  console.error(`${C.red}Terjadi kesalahan fatal pada SaipulAI CLI:${C.reset}`, err);
  process.exit(1);
});
