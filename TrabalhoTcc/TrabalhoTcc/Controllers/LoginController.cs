﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TrabalhoTcc.Models;
using TrabalhoTcc.Repositorio;

namespace TrabalhoTcc.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Logim()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Store(LoginCliente logincliente)
        {
            int identificador = new LoginClienteRepositorio().Cadastrar(logincliente);
            ViewBag.logincliente = logincliente;
            return View();
        }

    }
}