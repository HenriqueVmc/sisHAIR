﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TrabalhoTcc.Models
{
    public class Servicos
    {
        

        public int Id { get; set; }

        [Required(ErrorMessage = "Serviço não pode ser vasio")]
        public string Servico { get; set; }

        [Required(ErrorMessage = "Valor não pode ser vasio")]
        public double Valor { get; set; }

        [Required(ErrorMessage = "Duraçao não pode ser vasio")]
        public DateTime Duracao { get; set; }

        [Required(ErrorMessage = "Descriçao não pode ser vasio")]
        public string Descricao { get; set; }
    }
}