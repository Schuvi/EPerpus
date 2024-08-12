const pool = require("../database/index")
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt")
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

const perpusController = {
    getBooks: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("SELECT buku.id_buku, buku.judul_buku, buku.pengarang_buku, buku.penerbit_buku, buku.tahun_buku, buku_status.status, buku.gambar_buku, buku.file_buku, buku.deskripsi_buku FROM buku JOIN buku_status ON buku.status_buku = buku_status.id_status")
            res.json({
                data: rows
            })

        } catch (error) {
            console.error(error)
            res.json({
                state: "error"
            });
        }
    },

    getBooksById: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            const {id_buku} = req.query

            await connection.beginTransaction()

            const sql = "SELECT buku.id_buku, buku.judul_buku, buku.pengarang_buku, buku.penerbit_buku, buku.tahun_buku, buku_status.status, buku.gambar_buku, buku.file_buku, buku.deskripsi_buku FROM buku JOIN buku_status on buku.status_buku = buku_status.id_status WHERE buku.id_buku = ?"

            const [result] = await connection.query(sql, [id_buku])

            res.json({
                message: "Berhasil",
                data: result
            })
        } catch (error) {
            console.error(error)
            res.json({
                state: "error",
                message: "Gagal Mengambil Data"
            })
        } finally {
            connection.release()
        }
    },

    getBooksByCategories: async (req, res) => {
        const {kategori} = req.query
        try {
            const [rows, fields] = await pool.query(`SELECT buku.judul_buku, buku.pengarang_buku, buku.penerbit_buku, buku.tahun_buku, buku_status.status, buku.gambar_buku, buku.deskripsi_buku, buku.file_buku, buku_kategori.kategori FROM buku JOIN buku_status on buku.status_buku = buku_status.id_status JOIN kategori on buku.id_buku = kategori.id_buku JOIN buku_kategori on buku_kategori.id_kategori = kategori.kategori_buku WHERE buku_kategori.kategori = "${kategori}" `)
            res.json({
                data: rows
            })
        } catch (error) {
           console.error(error)
           res.json({
                state: "error"
           })
        }
    },

    getBooksByGenre : async (req, res) => {
        const {genre} = req.query
        try {
            const [rows, fields] = await pool.query(`SELECT buku.judul_buku, buku.pengarang_buku, buku.penerbit_buku, buku.tahun_buku, buku_status.status, buku.gambar_buku, buku.file_buku, buku.deskripsi_buku, buku_genre.genre FROM buku JOIN buku_status on buku.status_buku = buku_status.id_status JOIN genre on buku.id_buku = genre.id_buku JOIN buku_genre on buku_genre.id_genre = genre.genre WHERE buku_genre.genre = "${genre}"`)
            res.json({
                data: rows
            })
        } catch (error) {
            console.error(error)
            res.json({
                state: "error"
            })
        }
    },

    getBooksByPopularity: async (req,res) => {
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const sql = "SELECT * FROM buku JOIN buku_status on buku.status_buku = buku_status.id_status ORDER BY banyak_pinjaman DESC"

            const [result] = await connection.query(sql)

            await connection.commit()

            res.json({
                message: "Berhasil mengambil data buku",
                data: result
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                state: "error",
                message: "Gagal Mengambil Data Buku"
            })
        } finally {
            connection.release();
        }
    },

    getFavoriteBooks: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const {id_user} = req.query

            const sql = "SELECT buku_favorit.id_user, buku.judul_buku, buku.gambar_buku FROM buku_favorit JOIN buku ON buku_favorit.id_buku = buku.id_buku WHERE id_user = ?"

            const [result] = await connection.query(sql, [id_user])

            await connection.commit()

            res.json({
                message: "Berhasil mengambil data buku favorit",
                data: result
            })
        } catch (error) {
            console.error(error)
            res.json({
                state: "error",
                message: "Gagal mengambil data buku favorit"
            })
        } finally {
            connection.release()
        }
    },

    getBooksBorrowed: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const dipinjam = "Dipinjam"

            const sql = `SELECT * FROM buku JOIN buku_status on buku.status_buku = buku_status.id_status WHERE buku_status.status = "${dipinjam}"`

            const [result] = await connection.query(sql)

            await connection.commit()

            res.json({
                message: "Berhasil mengambil data buku yang dipinjam",
                data: result
            })
        } catch (error) {
            console.error(error)
            res.json({
                state: "error",
                message: "Gagal mengambil data buku yang dipinjam"
            })
        } finally {
            connection.release();
        }
    },

    makeFavorite: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const {id_buku, id_user} = req.query

            const sql = "INSERT INTO buku_favorit (id_user, id_buku) VALUES (?, ?)"

            const [result] =  await connection.query(sql, [id_buku, id_user])

            await connection.commit()
            
            res.status(200).json({
                message: "Berhasil menambahkan buku ke favorit",
                data: result
            })

        } catch (error) {
            console.error(error)
            res.status(500).json({
                state: "error",
                message: "Gagal menambahkan buku ke favorit"
            })
        } finally {
            connection.release()
        }
    },

    deleteFavorite: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const {id_user} = req.query

            const sql = "DELETE FROM buku_favorit WHERE id_user = ?"

            await connection.query(sql, [id_user])

            await connection.commit()

            res.json({
                message: "Berhasil menghapus buku dari favorit",
                id_user
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                state: "error",
                message: "Gagal menghapus buku dari favorit"
            })
        } finally {
            connection.release()
        }
    },

    searchBooks : async (req, res) => {
        const {cari} = req.query

        try {
            const [rows, field] = await pool.query(`SELECT buku.id_buku, buku.judul_buku, buku.pengarang_buku, buku.penerbit_buku, buku.tahun_buku, buku_status.status, buku.gambar_buku, buku.deskripsi_buku FROM buku JOIN buku_status on buku.status_buku = buku_status.id_status WHERE buku.judul_buku LIKE "%${cari}%" OR buku.pengarang_buku LIKE "%${cari}%"`)
            
            if (rows.length < 1) {
                res.json({
                    message: "Buku tidak ditemukan",
                })
            } else {
                res.json({
                    data: rows
                })
            }

        } catch (error) {
            console.error(error)
            res.json({
                state: "error"
            })
        }
    },

    searchBooksByCategories : async (req, res) => {
        const {cari} = req.query

        try {
            const [rows, field] = await pool.query(`SELECT buku.id_buku, buku.judul_buku, buku.pengarang_buku, buku.penerbit_buku, buku.tahun_buku, buku_status.status, buku.gambar_buku, buku.deskripsi_buku, buku_kategori.kategori FROM buku JOIN buku_status on buku.status_buku = buku_status.id_status JOIN kategori ON kategori.id_buku = buku.id_buku JOIN buku_kategori ON kategori.kategori_buku = buku_kategori.id_kategori WHERE buku_kategori.kategori LIKE "%${cari}%"`)
            
            if (rows.length < 1) {
                res.json({
                    message: "Buku tidak ditemukan",
                })
            } else {
                res.json({
                    data: rows
                })
            }

        } catch (error) {
            console.error(error)
            res.json({
                state: "error"
            })
        }
    },

    searchBooksByGenre : async (req, res) => {
        const {cari} = req.query

        try {
            const [rows, field] = await pool.query(`SELECT buku.id_buku, buku.judul_buku, buku.pengarang_buku, buku.penerbit_buku, buku.tahun_buku, buku_status.status, buku.gambar_buku, buku.deskripsi_buku, buku_genre.genre FROM buku JOIN buku_status on buku.status_buku = buku_status.id_status JOIN genre ON genre.id_buku = buku.id_buku JOIN buku_genre ON genre.genre = buku_genre.id_genre WHERE buku_genre.genre LIKE "%${cari}%"`)
            
            if (rows.length < 1) {
                res.json({
                    message: "Buku tidak ditemukan",
                })
            } else {
                res.json({
                    data: rows
                })
            }

        } catch (error) {
            console.error(error)
            res.json({
                state: "error"
            })
        }
    },

    createBooks : async (req, res) => {
        const connection = await pool.getConnection();
        try {
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(500).json({ state: 'error', error: err.message });
                }
    
                const { judul_buku, pengarang_buku, penerbit_buku, tahun_buku, status_buku, deskripsi_buku, kategori_buku, genre, file_buku, banyak_pinjaman } = req.body;
    
                const gambar_buku = req.files['gambar_buku'] ? `/buku/${req.files['gambar_buku'][0].filename}` : null;
    
                await connection.beginTransaction();
    
                const sql = "INSERT INTO buku (judul_buku, pengarang_buku, penerbit_buku, tahun_buku, status_buku, gambar_buku, deskripsi_buku, file_buku, banyak_pinjaman) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0);";
    
                const [resultBuku] = await connection.query(sql, [judul_buku, pengarang_buku, penerbit_buku, tahun_buku, status_buku, gambar_buku, deskripsi_buku,file_buku, banyak_pinjaman]);
    
                const bukuId = resultBuku.insertId;
    
                const sqlKategori = "INSERT INTO kategori (id_buku, kategori_buku) VALUES (?, ?);";
                const sqlGenre = "INSERT INTO genre (id_buku, genre) VALUES (?, ?);";
    
                await connection.query(sqlKategori, [bukuId, kategori_buku]);
                await connection.query(sqlGenre, [bukuId, genre]);
    
                await connection.commit();
    
                res.status(201).json({
                    message: "Berhasil Membuat Buku",
                    insertId: bukuId,
                    affectedRows: resultBuku.affectedRows
                });
            });
        } catch (error) {
            await connection.rollback();
            console.log(error);
            res.status(500).json({
                state: "error",
                error: error.message
            });
        } finally {
            connection.release();
        }
    },

    updateBooks: async (req, res) => {
        const connection = await pool.getConnection();
        try {
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(500).json({ state: 'error', error: err.message });
                }
    
                const { judul_buku, pengarang_buku, penerbit_buku, tahun_buku, status_buku, deskripsi_buku, kategori_buku, genre, file_buku, banyak_pinjaman } = req.body;
                const { id_buku } = req.query;
    
                await connection.beginTransaction();
    
                // Fetch the current book image path
                const sqlSelectImage = "SELECT gambar_buku FROM buku WHERE id_buku = ?;";
                const [rows] = await connection.query(sqlSelectImage, [id_buku]);
    
                if (rows.length === 0) {
                    throw new Error('Buku tidak ditemukan');
                }
    
                const oldImagePath = rows[0].gambar_buku;
                let newImagePath = oldImagePath;
    
                // If a new image is uploaded, update the image path and delete the old image
                if (req.files && req.files['gambar_buku']) {
                    newImagePath = `/buku/${req.files['gambar_buku'][0].filename}`;
    
                    if (oldImagePath) {
                        const fullOldImagePath = path.join(__dirname, '../../ePerpus/public/buku', path.basename(oldImagePath));
                        fs.unlink(fullOldImagePath, (err) => {
                            if (err) {
                                console.error(`Gagal menghapus file: ${fullOldImagePath}`, err);
                            } else {
                                console.log(`Berhasil menghapus file: ${fullOldImagePath}`);
                            }
                        });
                    }
                }
    
                const sqlUpdateBook = "UPDATE buku SET judul_buku = ?, pengarang_buku = ?, penerbit_buku = ?, tahun_buku = ?, status_buku = ?, deskripsi_buku = ?, gambar_buku = ?, file_buku = ?, banyak_pinjaman = ? WHERE id_buku = ?;";
                const [resultBuku] = await connection.query(sqlUpdateBook, [judul_buku, pengarang_buku, penerbit_buku, tahun_buku, status_buku, deskripsi_buku, newImagePath, file_buku, banyak_pinjaman, id_buku]);
    
                const sqlUpdateKategori = "UPDATE kategori SET kategori_buku = ? WHERE id_buku = ?;";
                const sqlUpdateGenre = "UPDATE genre SET genre = ? WHERE id_buku = ?;";
    
                await connection.query(sqlUpdateKategori, [kategori_buku, id_buku]);
                await connection.query(sqlUpdateGenre, [genre, id_buku]);
    
                await connection.commit();
    
                res.json({
                    message: "Berhasil Memperbarui Buku",
                    affectedRows: id_buku
                });
            });
        } catch (error) {
            await connection.rollback();
            console.log(error);
            res.status(500).json({
                state: "error",
                error: error.message
            });
        } finally {
            connection.release();
        }
    },

    deleteBooks: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            const { id_buku } = req.query
    
            await connection.beginTransaction()
    
            const sqlSelectImage = "SELECT gambar_buku FROM buku WHERE id_buku = ?;"
            const [rows] = await connection.query(sqlSelectImage, [id_buku])
            
            if (rows.length === 0) {
                throw new Error('Buku tidak ditemukan');
            }
    
            const imagePath = rows[0].gambar_buku;
    
            const fullImagePath = path.join(__dirname, '/buku', path.basename(imagePath));
    
            fs.unlink(fullImagePath, (err) => {
                if (err) {
                    console.error(`Gagal menghapus file: ${fullImagePath}`, err);
                } else {
                    console.log(`Berhasil menghapus file: ${fullImagePath}`);
                }
            });
    
            const sqlDeleteKategori = "DELETE FROM kategori WHERE id_buku = ?;"
            const sqlDeleteGenre = "DELETE FROM genre WHERE id_buku = ?;"
            const sqlDeleteBuku = "DELETE FROM buku WHERE id_buku = ?;"
    
            await connection.query(sqlDeleteKategori, [id_buku])
            await connection.query(sqlDeleteGenre, [id_buku])
            const [resultBuku] = await connection.query(sqlDeleteBuku, [id_buku])
    
            await connection.commit()
    
            res.json({
                message: "Berhasil Menghapus Buku",
                affectedRows: resultBuku.affectedRows
            })
        } catch (error) {
            await connection.rollback()
            console.log(error)
            res.status(500).json({
                state: "error",
                error: error.message
            })
        } finally {
            connection.release()
        }
    },

    pengembalianBuku: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            const {id} = req.query

            await connection.beginTransaction()

            const sqlPinjam = `UPDATE buku SET status_buku = 1 WHERE id_buku = ${id}`

            const [result] = await connection.query(sqlPinjam)

            await connection.commit()

            res.json({
                message: "Berhasil Meminjam Buku",
                affectedRows: result.affectedRows
            })

        } catch (error) {
            console.log(error)
            response.status(500).json({
                state: "error", error
            })
        } finally {
            connection.release()
        }
    }, 

    rusakBuku: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            const {id} = req.query

            await connection.beginTransaction()

            const sqlPinjam = `UPDATE buku SET status_buku = 3 WHERE id_buku = ${id}`

            const [result] = await connection.query(sqlPinjam)

            await connection.commit()

            res.json({
                message: "Berhasil Meminjam Buku",
                affectedRows: result.affectedRows
            })

        } catch (error) {
            console.log(error)
            response.status(500).json({
                state: "error", error
            })
        } finally {
            connection.release()
        }
    },

    createTransaction: async (req, res) => {
        const connection = await pool.getConnection();
        try {
            const { id_user, tanggal_peminjaman, tanggal_pengembalian, buku_ids } = req.body;
            const quantity = buku_ids.length;
            const id_referensi = `REF_${uuidv4()}`;
    
            await connection.beginTransaction();
    
            const sqlTransaksi = `
                INSERT INTO transaksi (id_referensi, id_user, tanggal_peminjaman, tanggal_pengembalian, quantity)
                VALUES (?, ?, ?, ?, ?);
            `;
    
            await connection.query(sqlTransaksi, [
                id_referensi,
                id_user,
                tanggal_peminjaman,
                tanggal_pengembalian,
                quantity
            ]);
    
            const sqlDetailTransaksi = `
                INSERT INTO detail_transaksi (id_transaksi, buku)
                VALUES (?, ?);
            `;
    
            const sqlPinjam = `UPDATE buku SET status_buku = 2 WHERE id_buku = ?`;
    
            const sqlUpdateBanyakPinjam = `UPDATE buku SET banyak_pinjaman = banyak_pinjaman + 1 WHERE id_buku = ?`;

            const sqlUserBanyakPinjam = `UPDATE user_data SET banyak_meminjam = banyak_meminjam + 1 WHERE id_user = ?`
    
            for (const id_buku of buku_ids) {
                await connection.query(sqlDetailTransaksi, [id_referensi, id_buku]);
                await connection.query(sqlPinjam, [id_buku]);
                await connection.query(sqlUpdateBanyakPinjam, [id_buku]);
                await connection.query(sqlUserBanyakPinjam, [id_user])
            }
    
            await connection.commit();
    
            res.status(201).json({
                message: "Berhasil Membuat Transaksi",
                id_referensi
            });
        } catch (error) {
            await connection.rollback();
            console.error(error);
            res.status(500).json({
                state: "error",
                error: error.message
            });
        } finally {
            connection.release();
        }
    },

    getUserById: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            const {id_user} = req.query
            
            await connection.beginTransaction()

            const sql = "SELECT * FROM user_data WHERE id_user = ?"

            const [result] = await connection.query(sql, [id_user])

            await connection.commit()
            
            if (result.length <= 1) {
                res.status(404).json({
                    state: "error",
                    message: "User tidak ditemukan"
                })
            } else {
                res.status(200).json({
                    state: "success",
                    data: result
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({
                state: "error",
                message: "Gagal Mengambil Data User"
            })
        } finally {
            connection.release();
        }
    },

    getUser: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const sql = "SELECT user_data.id_user, user_data.nama_lengkap, user_data.email, user_data.role, user_status.status_user FROM user_data JOIN user_status ON user_data.status = user_status.id"

            const [result] = await connection.query(sql)

            await connection.commit()

            res.json({
                state: "Berhasil Mengambil Data User",
                data: result
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                state: "error",
                message: "Gagal Mengambil Data User"
            })
        } finally {
            connection.release();
        }
    },

    createUser: async (req, res) => {
        const connection = await pool.getConnection();
        try {
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(500).json({ state: 'error', error: err.message });
                }
    
                const { id_user, nama_lengkap, email, password, role } = req.body;
                const gambar_profil = req.files['gambar_profil'] ? `/user/${req.files['gambar_profil'][0].filename}` : null;
    
                const hashedPassword = await bcrypt.hash(password, 10);
    
                await connection.beginTransaction();
    
                const sqlUser = `INSERT INTO user_data (id_user, nama_lengkap, email, password, gambar_profil, role, status, banyak_meminjam) VALUES (?, ?, ?, ?, ?, ?, 3, 0)`;
    
                await connection.query(sqlUser, [id_user, nama_lengkap, email, hashedPassword, gambar_profil, role]);
    
                await connection.commit();
    
                res.json({
                    message: "Berhasil Membuat User",
                    id_user
                });
            });
        } catch (error) {
            await connection.rollback();
            console.error(error);
            res.status(500).json({
                state: "error",
                error: error.message
            });
        } finally {
            connection.release();
        }
    },

    login: async (req, res) => {
        const connection = await pool.getConnection();
        try {
            const { username, password } = req.body;
    
            console.log({"username": username});
            
            await connection.beginTransaction();
    
            const sqlLogin = `SELECT * FROM user_data WHERE nama_lengkap = ?`;
            const [result] = await connection.query(sqlLogin, [username]);
    
            await connection.commit();
    
            if (result.length === 0) {
                return res.json({
                    state: "error",
                    message: "User tidak ditemukan"
                });
            }
    
            const user = result[0];
            
            const passwordMatch = await bcrypt.compare(password, user.password);
    
            if (!passwordMatch) {
                return res.json({
                    state: "error",
                    message: "Password salah"
                });
            }
    
            if (user.role === 'user') {
                if (user.status === 1) {
                    return res.json({
                        state: "error",
                        message: "Akun Anda Telah Login di Perangkat Lain"
                    })
                } else if (user.status === 4) {
                    return res.json({
                        state: "error",
                        message: "Akun Anda Telah Diblokir"
                    })
                } else {
                    return res.json({
                        message: "Berhasil Login sebagai User",
                        data: user
                    });
                }
                
            } else if (user.role === 'admin') {
                return res.json({
                    message: "Berhasil Login sebagai Admin",
                    data: user
                });
            } else {
                return res.json({
                    state: "error",
                    message: "Role tidak dikenal"
                });
            }
    
        } catch (error) {
            console.error(error);
            await connection.rollback();
            res.json({
                state: "error",
                message: error.message
            });
        } finally {
            connection.release();
        }
    },

    updateStatusLogin: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            const {id_user} = req.query
            
            await connection.beginTransaction()

            const sqlUpdateLogin = `UPDATE user_data SET status = 1 WHERE id_user = ?`

            await connection.query(sqlUpdateLogin, [id_user])

            await connection.commit()

            res.json({
                message: "Berhasil Login",
            })

        } catch (error) {
            console.error(error)
            res.json({
                state: "error",
                message: error.message
            })
        } finally {
            connection.release()
        }
    },

    logout: async (req, res) => {
        const connection = await pool.getConnection()
        try {
            const {id_user} = req.query

            await connection.beginTransaction()

            const sqlLogout = `UPDATE user_data SET status = 2 WHERE id_user = ?`

            await connection.query(sqlLogout, [id_user])

            await connection.commit()

            res.json({
                message: "Berhasil Logout"
            })

        } catch (error) {
            console.error(error)
            res.json({
                state: "error",
                message: error.message
            })
        } finally {
            connection.release();
        }
    },

    deleteUser: async (req, res) => {
        const connection = await pool.getConnection();
        try {
            const { id_user } = req.query;
    
            await connection.beginTransaction();
    
            const sqlSelectImage = "SELECT gambar_profil FROM user_data WHERE id_user = ?;";
            const [rows] = await connection.query(sqlSelectImage, [id_user]);
    
            if (rows.length === 0) {
                throw new Error('User tidak ditemukan');
            }
    
            const imagePath = rows[0].gambar_profil;
    
            if (imagePath) {
                const fullImagePath = path.join(__dirname, '../../ePerpus/public/user', path.basename(imagePath));
    
                fs.unlink(fullImagePath, (err) => {
                    if (err) {
                        console.error(`Gagal menghapus file: ${fullImagePath}`, err);
                    } else {
                        console.log(`Berhasil menghapus file: ${fullImagePath}`);
                    }
                });
            }
    
            const sqlDeleteUser = "DELETE FROM user_data WHERE id_user = ?;";
            await connection.query(sqlDeleteUser, [id_user]);
    
            await connection.commit();
    
            res.json({
                message: "Berhasil Menghapus User",
                affectedRows: id_user
            });
        } catch (error) {
            await connection.rollback();
            console.log(error);
            res.status(500).json({
                state: "error",
                error: error.message
            });
        } finally {
            connection.release();
        }
    },

    editUser: async (req, res) => {
        const connection = await pool.getConnection();
        try {
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(500).json({ state: 'error', error: err.message });
                }
                
                const {id_user} = req.query

                const { nama_lengkap, email, password, role } = req.body;
    
                const hashedPassword = await bcrypt.hash(password, 10);
    
                await connection.beginTransaction();
    
                // Fetch the current profile image path
                const sqlSelectImage = "SELECT gambar_profil FROM user_data WHERE id_user = ?;";
                const [rows] = await connection.query(sqlSelectImage, [id_user]);
    
                if (rows.length === 0) {
                    throw new Error('User tidak ditemukan');
                }
    
                const oldImagePath = rows[0].gambar_profil;
                let newImagePath = oldImagePath;
    
                // If a new image is uploaded, update the image path and delete the old image
                if (req.files && req.files['gambar_profil']) {
                    newImagePath = `/user/${req.files['gambar_profil'][0].filename}`;
    
                    if (oldImagePath) {
                        const fullOldImagePath = path.join(__dirname, '../../ePerpus/public/user', path.basename(oldImagePath));
                        fs.unlink(fullOldImagePath, (err) => {
                            if (err) {
                                console.error(`Gagal menghapus file: ${fullOldImagePath}`, err);
                            } else {
                                console.log(`Berhasil menghapus file: ${fullOldImagePath}`);
                            }
                        });
                    }
                }
    
                const sqlUpdateUser = `UPDATE user_data SET nama_lengkap = ?, email = ?, password = ?, gambar_profil = ?, banyak_pinjaman = ?, role = ? WHERE id_user = ?;`;
    
                await connection.query(sqlUpdateUser, [nama_lengkap, email, hashedPassword, newImagePath, banyak_pinjaman, role, id_user]);
    
                await connection.commit();
    
                res.json({
                    message: "Berhasil Mengedit User",
                    id_user
                });
            });
        } catch (error) {
            await connection.rollback();
            console.error(error);
            res.status(500).json({
                state: "error",
                error: error.message
            });
        } finally {
            connection.release();
        }
    },

    getUserByBorrow: async (req, res) => {
        const connection = await pool.getConnection()

        try {
            await connection.beginTransaction()

            const sql = "SELECT user_data.id_user, user_data.nama_lengkap, user_data.email, user_data.role, user_data.gambar_profil, user_data.banyak_meminjam FROM user_data ORDER BY user_data.banyak_meminjam DESC"

            const [result] = await connection.query(sql)

            await connection.commit()

            res.json({
                message: "Berhasil Mengambil Data User",
                data: result
            })
        } catch (error) {
            console.error(error)
            res.statu(500).json({
                state: "error",
                message: "Gagal Mengambil Data User"
            })
        } finally {
            connection.release();
        }
    }
}

module.exports = perpusController;