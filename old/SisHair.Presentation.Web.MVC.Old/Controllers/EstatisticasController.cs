﻿using SisHair.Presentation.Web.MVC.Old.Context;
using System;
using System.Linq;
using System.Web.Mvc;

namespace SisHair.Presentation.Web.MVC.Old.Controllers
{
    public class EstatisticasController : Controller
    {
        private DBContext db = new DBContext();
        // GET: Estatisticas
        public ActionResult Index()
        {
            return View();
        }

        [Authorize(Roles = "Administrador, Funcionario")]
        public ActionResult Agendamentos()
        {

            return View();
        }

        [HttpGet]
        public JsonResult GetAgendamentosByMes()
        {
            //SELECT MONTH(DataHoraFinal), COUNT(DataHoraFinal) FROM Agendamentoes WHERE YEAR(DataHoraFinal) = '2018' GROUP BY  MONTH(DataHoraFinal);
            try
            {
                var x = from ag in db.Agendamentos
                        where ag.DataHoraFinal.Year == DateTime.Now.Year
                        group ag by ag.DataHoraFinal.Month into groupmonth
                        select new
                        {
                            Quantidade = groupmonth.Count(),
                            Mes = groupmonth.Key
                        };
                var registros = x.ToList();

                var valores = new int[12];
                foreach (var y in registros)
                {
                    valores[(y.Mes) - 1] = y.Quantidade;
                }
                //var agendamentosbyMes = db.Agendamentos.Where(a => a.DataHoraFinal.Year == DateTime.Now.Year).GroupBy(a => a.DataHoraFinal.Month).Count();            

                return new JsonResult { Data = valores, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e) { ModelState.AddModelError("", "Confira os dados e tente novamente"); }
            return null;
        }

        public ActionResult Funcionarios()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetAgendamentosByMesFuncionarios()
        {
            //SELECT COUNT(a.DataHoraFinal) FROM Agendamentoes a  WHERE YEAR(a.DataHoraFinal) = 2018 GROUP BY a.FuncionarioId; 
            try
            {
                var x = from ag in db.Agendamentos
                        where ag.DataHoraFinal.Year == DateTime.Now.Year
                        group ag by ag.FuncionarioId into groupFunc
                        select new
                        {
                            Quantidade = groupFunc.Count()
                        };
                var registros = x.ToList();

                var valores = new int[registros.Count];
                int i = 0;
                foreach (var y in registros)
                {
                    valores[i] = y.Quantidade;
                    i++;
                }
                //var agendamentosbyMes = db.Agendamentos.Where(a => a.DataHoraFinal.Year == DateTime.Now.Year).GroupBy(a => a.DataHoraFinal.Month).Count();            

                return new JsonResult { Data = valores, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e) { ModelState.AddModelError("", "Confira os dados e tente novamente"); }
            return null;
        }

        [HttpGet]
        public JsonResult GetFuncionarios()
        {
            //SELECT COUNT(a.DataHoraFinal) FROM Agendamentoes a  WHERE YEAR(a.DataHoraFinal) = 2018 GROUP BY a.FuncionarioId; 
            try
            {
                var x = from ag in db.Agendamentos
                        where ag.DataHoraFinal.Year == DateTime.Now.Year
                        group ag by ag.Funcionario.Nome into groupFunc
                        select new
                        {
                            Nome = groupFunc.Key
                        };
                var registros = x.ToList();

                var valores = new string[registros.Count];
                int i = 0;
                foreach (var y in registros)
                {
                    valores[i] = y.Nome;
                    i++;
                }
                //var agendamentosbyMes = db.Agendamentos.Where(a => a.DataHoraFinal.Year == DateTime.Now.Year).GroupBy(a => a.DataHoraFinal.Month).Count();            

                return new JsonResult { Data = valores, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e) { ModelState.AddModelError("", "Confira os dados e tente novamente"); }
            return null;
        }
    }
}