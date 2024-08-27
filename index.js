import express from "express";
import Task from "./models/Task.js";
import siap from "./models/siaps.js";
import {
  getLoginUser,
  getRegisUser,
  logout,
  postLoginUser,
  postRegisUser,
} from "./controlsUser/logins.js";
import session from "express-session";
import berhasil_login from "./controlsUser/autorisasi.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "iasdsad212312dsf123",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

app.get("/login", getLoginUser);
app.get("/logout", logout);
app.get("/regis", getRegisUser);
app.post("/regis", postRegisUser);
app.post("/login", postLoginUser);

app.get("/", berhasil_login, (req, res) => {
  Task.findAll()
    .then((data) => {
      res.render("index", { data: data, user: req.session.user || "" });
    })
    .catch((err) => console.error(err));
});

app.get("/tambah", berhasil_login, (req, res) => {
  res.render("tambah");
});
app.post("/tambah", (req, res) => {
  const { nama, namaTugas, waktu } = req.body;
  Task.create({ nama, namaTugas, waktu })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.error(err));
});

app.get("/edit/:id", berhasil_login, (req, res) => {
  const { id } = req.params;
  Task.findOne({ where: { id: id } })
    .then((data) => {
      res.render("edit", { data: data });
    })
    .catch((err) => console.error(err));
});

app.get("/selesai", berhasil_login, (req, res) => {
  siap
    .findAll()
    .then((data) => {
      res.render("selesai", { data: data });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/selesai/:id", berhasil_login, (req, res) => {
  Task.findOne({ where: { id: req.params.id } }).then((data) => {
    siap
      .create({
        nama: data.nama,
        namaTugas: data.namaTugas,
        waktu: data.waktu,
      })
      .then(() => {
        console.log("behasil selesai");
      })
      .catch((err) => console.error(err));
    Task.destroy({ where: { id: req.params.id } })
      .then(() => {
        console.log("berhasil dihapus");
        res.redirect("/");
      })
      .catch((err) => console.error(err));
  });
});
app.put("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { nama, namaTugas, waktu } = req.body;
  Task.update({ nama, namaTugas, waktu }, { where: { id } })
    .then(() => {
      res.status(200).json({ message: "Berhasil di update" });
    })
    .catch((err) => {
      res.status(400).json({ msg: "Gagal di update" });
      console.error(err);
    });
});

app.delete("/hapus/:id", (req, res) => {
  Task.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.status(200).json({ message: "Berhasil di update" });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.delete("/selesai/:id", (req, res) => {
  siap
    .destroy({ where: { id: req.params.id } })
    .then(() => {
      res.status(200).json({ message: "Berhasil di update" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(5000, () => {
  console.log("listening on port http://localhost:5000");
});
