<?php

namespace Database\Seeders;

use App\Models\Story;
use Illuminate\Database\Seeder;

class StorySeeder extends Seeder
{
    public function run(): void
    {
        $stories = [
            [
                'title' => 'Mengenal Karakter Kopi Nusantara',
                'slug' => 'mengenal-karakter-kopi-nusantara',
                'category' => 'Origin',
                'excerpt' => 'Mulai mengenali kopi dari asal, proses, dan rasa yang Anda temukan di dalam cangkir.',
                'pull_quote' => 'Anggap catatan rasa sebagai panduan untuk mencoba, bukan janji bahwa setiap orang akan merasakan hal yang persis sama.',
                'quote_attribution' => 'Tim editorial Deklase',
                'cover_caption' => 'Kopi dan waktu untuk menikmati seduhan.',
                'body_html' => <<<'HTML'
                    <h2>Mulai dari asal kopi</h2>
                    <p>Nama daerah pada kemasan kopi memberi titik awal untuk mengenali bijinya. Namun, dua kopi dari daerah yang sama tidak harus terasa sama. Varietas, kondisi tumbuh, proses setelah panen, tingkat sangrai, dan cara seduh ikut membentuk hasil akhirnya.</p>
                    <p>Saat memilih kopi, baca informasi origin bersama keterangan proses dan taste notes. Anggap catatan rasa sebagai panduan untuk mencoba, bukan janji bahwa setiap orang akan merasakan hal yang persis sama.</p>
                    <h2>Bandingkan dengan cara seduh yang sama</h2>
                    <p>Jika ingin mencoba dua kopi Nusantara, gunakan jumlah kopi, air, alat, dan ukuran gilingan yang sama. Cara ini membantu Anda memperhatikan perbedaannya tanpa terlalu banyak mengubah variabel sekaligus.</p>
                    <ul><li>Cium aroma kopi sebelum dan sesudah diseduh.</li><li>Cicipi ketika hangat, lalu ulangi setelah suhunya turun.</li><li>Catat rasa manis, keasaman, tekstur, dan rasa yang tertinggal.</li></ul>
                    <h2>Temukan karakter yang Anda sukai</h2>
                    <p>Tidak perlu langsung mengenali semua catatan rasa. Mulai dengan pertanyaan sederhana: apakah kopi ini terasa ringan atau penuh, lembut atau tajam, dan apakah Anda ingin meminumnya lagi? Catatan pribadi tersebut lebih berguna daripada memaksakan istilah yang belum terasa jelas.</p>
                    HTML,
                'cover_image_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1800&q=90',
                'published_at' => '2026-09-01 09:00:00',
            ],
            [
                'title' => 'Panduan Seduh V60 di Rumah',
                'slug' => 'panduan-seduh-v60-di-rumah',
                'category' => 'Brewing',
                'excerpt' => 'Resep awal V60 yang mudah diulang, lalu disesuaikan dengan kopi dan selera Anda.',
                'pull_quote' => 'Resep ini adalah titik awal, bukan aturan mutlak.',
                'quote_attribution' => 'Tim editorial Deklase',
                'cover_caption' => 'Satu seduhan, dibuat dengan tenang.',
                'body_html' => <<<'HTML'
                    <h2>Siapkan alat dan bahan</h2>
                    <p>Untuk mulai mencoba, siapkan dripper V60, kertas filter yang sesuai, timbangan, ketel, dan wadah seduh. Gunakan 15 gram kopi dengan 250 gram air sebagai resep awal. Pilih gilingan medium-fine, lalu sesuaikan berdasarkan hasil seduhan.</p>
                    <p>Bilas kertas filter dengan air panas untuk membasahi kertas sekaligus menghangatkan alat. Buang air bilasan sebelum memasukkan kopi. Ratakan permukaan bubuk kopi dan letakkan alat di atas timbangan.</p>
                    <h2>Tuang perlahan dan bertahap</h2>
                    <ol><li>Mulai timer, lalu tuang sekitar 45 gram air untuk membasahi seluruh bubuk kopi.</li><li>Tunggu sekitar 30–45 detik sebelum melanjutkan tuangan.</li><li>Tuang perlahan hingga timbangan menunjukkan 150 gram, lalu lanjutkan hingga total 250 gram.</li><li>Biarkan air mengalir melalui kopi. Setelah selesai, angkat dripper dan aduk kopi di wadah sebelum disajikan.</li></ol>
                    <h2>Ubah satu hal setiap kali mencoba</h2>
                    <p>Resep ini adalah titik awal, bukan aturan mutlak. Jika hasilnya terasa kurang terekstraksi, coba gilingan sedikit lebih halus. Jika terasa terlalu pahit atau alirannya sangat lambat, coba gilingan sedikit lebih kasar. Pertahankan variabel lain saat membandingkan agar perubahan rasanya lebih mudah dikenali.</p>
                    <p>Catat ukuran gilingan, jumlah air, waktu seduh, dan hasil rasanya. Resep yang dapat Anda ulang akan lebih membantu daripada mengejar satu angka waktu seduh untuk semua kopi.</p>
                    HTML,
                'cover_image_url' => 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1800&q=90',
                'published_at' => '2026-09-03 09:00:00',
            ],
            [
                'title' => 'Menjaga Kesegaran Biji Kopi',
                'slug' => 'menjaga-kesegaran-biji-kopi',
                'category' => 'Coffee Guide',
                'excerpt' => 'Kebiasaan penyimpanan sederhana untuk menjaga kopi tetap nyaman dinikmati setiap hari.',
                'pull_quote' => 'Perubahan rasa dipengaruhi oleh jenis kopi, sangrai, kemasan, dan kondisi penyimpanan.',
                'quote_attribution' => 'Tim editorial Deklase',
                'cover_caption' => 'Kopi dan kebiasaan kecil di balik setiap cangkir.',
                'body_html' => <<<'HTML'
                    <h2>Perhatikan tempat penyimpanan</h2>
                    <p>Simpan kopi di tempat yang sejuk, kering, dan tidak terkena sinar matahari langsung. Hindari meletakkan kemasan dekat kompor atau area yang sering berubah suhu. Tutup kembali kemasan atau wadah setelah mengambil biji kopi.</p>
                    <p>Jika kemasan memiliki penutup yang dapat digunakan ulang, pastikan penutupnya rapat. Bila perlu memindahkan kopi ke wadah lain, pilih wadah bersih, kering, dan tertutup rapat agar biji tidak terpapar udara terus-menerus.</p>
                    <h2>Giling sesuai kebutuhan</h2>
                    <p>Jika memiliki grinder, simpan kopi sebagai biji dan giling mendekati waktu seduh. Ambil secukupnya untuk satu seduhan, lalu segera tutup kembali wadah. Kebiasaan kecil ini juga membantu Anda menjaga jumlah kopi yang digunakan tetap konsisten.</p>
                    <ul><li>Gunakan sendok atau alat takar yang bersih dan kering.</li><li>Jauhkan kopi dari bahan beraroma kuat.</li><li>Beli jumlah yang sesuai dengan kebiasaan minum Anda.</li><li>Catat tanggal membuka kemasan untuk membandingkan hasil seduhan.</li></ul>
                    <h2>Jangan mengandalkan satu batas waktu</h2>
                    <p>Perubahan rasa dipengaruhi oleh jenis kopi, sangrai, kemasan, dan kondisi penyimpanan. Gunakan informasi pada kemasan sebagai panduan, lalu perhatikan aroma serta rasa dari hari ke hari. Bila rasanya berubah, catatan seduhan Anda dapat membantu menentukan kapan kopi paling sesuai dengan selera.</p>
                    HTML,
                'cover_image_url' => 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1800&q=90',
                'published_at' => '2026-09-05 09:00:00',
            ],
        ];

        foreach ($stories as $story) {
            Story::query()->firstOrCreate(['slug' => $story['slug']], [
                ...$story,
                'author_name' => 'Deklase',
                'status' => 'published',
            ]);
        }
    }
}
