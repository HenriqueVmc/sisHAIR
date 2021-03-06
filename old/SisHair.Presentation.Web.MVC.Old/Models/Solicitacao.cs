﻿using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SisHair.Presentation.Web.MVC.Old.Models
{
    public class Solicitacao
    {
        [Key]
        public int Id { get; set; }
        //[Required(ErrorMessage="Hora deve ser preenchida")]
        [Required(ErrorMessage = "Horarios devem ser preenchidos")]
        [Display(Name = "Horario de Inicio:")]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy HH:mm}", ApplyFormatInEditMode = true)]
        public DateTime DataHoraInicio { get; set; }

        [Required(ErrorMessage = "Horarios devem ser preenchidos")]
        [Display(Name = "Horario Final:")]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy HH:mm}", ApplyFormatInEditMode = true)]
        public DateTime DataHoraFinal { get; set; }

        //[Required(ErrorMessage="Situacao deve ser preenchida")]
        //[MinLength(8, ErrorMessage="Situacao deve conter no mínimo 8 caracateres")]
        //[MaxLength(50, ErrorMessage="Situacao não deve exceder 50 caracteres")]
        [Display(Name = "Situação: ")]
        public string Situacao { get; set; }

        [Display(Name = "Funcionário: ")]
        public virtual Funcionario Funcionario { get; set; }
        public int FuncionarioId { get; set; }

        [Display(Name = "Cliente: ")]
        public virtual Cliente Cliente { get; set; }
        public int ClienteId { get; set; }

        [Display(Name = "Descrição:")]
        public string Descricao { get; set; }

        [Display(Name = "Servicos:")]
        public string Servicos { get; set; }
        [DefaultValue(true)]
        public bool RegistroSolicitacaoAtivo { get; set; }

    }
}