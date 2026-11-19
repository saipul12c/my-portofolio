import { karakterNama } from "../data/karakterNama";
import { deskripsiAngka } from "../data/numerologyDescriptions";

export const hitungNumerologi = (nama, tanggalLahir) => {
    if (!nama || !tanggalLahir) {
        return {
            angkaHidup: 5,
            angkaTakdir: 5,
            deskripsiAngkaHidup: "Belum dihitung",
            deskripsiAngkaTakdir: "Belum dihitung",
            elemenNama: "Netral",
            energiNama: 50
        };
    }

    const namaAngka = nama.toUpperCase().split("").reduce((acc, char) => {
        return acc + (karakterNama[char]?.angka || 0);
    }, 0);

    const angkaHidup = (namaAngka % 9) || 9;

    const tgl = tanggalLahir.getDate();
    const bln = tanggalLahir.getMonth() + 1;
    const thn = tanggalLahir.getFullYear();

    const tglAngka = String(tgl).split("").reduce((a, b) => parseInt(a) + parseInt(b), 0);
    const blnAngka = String(bln).split("").reduce((a, b) => parseInt(a) + parseInt(b), 0);
    const thnAngka = String(thn).split("").reduce((a, b) => parseInt(a) + parseInt(b), 0);
    const angkaTakdir = (tglAngka + blnAngka + thnAngka) % 9 || 9;

    const energiNama = Math.min((namaAngka * 2) % 100, 100);

    return {
        angkaHidup,
        angkaTakdir,
        deskripsiAngkaHidup: deskripsiAngka[angkaHidup]?.deskripsi || "Tidak tersedia",
        deskripsiAngkaTakdir: deskripsiAngka[angkaTakdir]?.deskripsi || "Tidak tersedia",
        judulAngkaHidup: deskripsiAngka[angkaHidup]?.judul || "Tidak tersedia",
        judulAngkaTakdir: deskripsiAngka[angkaTakdir]?.judul || "Tidak tersedia",
        elemenNama: karakterNama[nama[0]?.toUpperCase()]?.elemen || "Netral",
        energiNama,
        tglLahir: `${tgl}/${bln}/${thn}`,
        analisisLengkap: `Nama "${nama}" memiliki angka hidup ${angkaHidup} (${deskripsiAngka[angkaHidup]?.judul}) dan angka takdir ${angkaTakdir} (${deskripsiAngka[angkaTakdir]?.judul}) berdasarkan tanggal lahir ${tgl}/${bln}/${thn}.`
    };
};