﻿using SisHair.Presentation.Web.MVC.Old.Context;
using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Web.Mvc;

namespace SisHair.Presentation.Web.MVC.Old.Models
{
    public class EnderecoFuncionario
    {
        [Key]
        public int Id { get; set; }
        [Display(Name = "Rua:")]
        public string Rua { get; set; }

        [Display(Name = "Bairro:")]
        public string Bairro { get; set; }

        [Display(Name = "Número:")]
        public int Numero { get; set; }

        [Display(Name = "Complemento:")]
        public string Complemento { get; set; }

        [Display(Name = "Cidade:")]
        public string Cidade { get; set; }

        [Display(Name = "UF:")]
        public string Estado { get; set; }

        [Display(Name = "CEP:")]
        public string Cep { get; set; }

        public virtual Funcionario Funcionario { get; set; }

        public int FuncionarioId { get; set; }

        public bool RegistroEnderecoFuncionarioAtivo { get; set; }

        private DBContext db = new DBContext();

        public EnderecoFuncionario CadastrarEndereco([Bind(Include = "Id, Rua, Bairro, Numero, Complemento, Estado, Cidade, Cep")]EnderecoFuncionario endereco, int idFunc)
        {
            var cadastro = new EnderecoFuncionario()
            {
                Rua = endereco.Rua,
                Bairro = endereco.Bairro,
                Numero = endereco.Numero,
                Complemento = endereco.Complemento,
                Estado = endereco.Estado,
                Cidade = endereco.Cidade,
                Cep = endereco.Cep,
                FuncionarioId = idFunc
            };

            if (cadastro != null)
            {
                db.EnderecoFuncionarios.Add(cadastro);
                db.SaveChanges();
            }

            return cadastro;
        }

        public void EditarEndereco(EnderecoFuncionario endereco)//[Bind(Include ="Rua,Bairro,Numero,Cidade,Complemento,Estado,Cep")]
        {
            try
            {
                db.Entry(endereco).State = EntityState.Modified;
                db.SaveChanges();
            }catch(Exception e) { return; }
        }

       
    }
}