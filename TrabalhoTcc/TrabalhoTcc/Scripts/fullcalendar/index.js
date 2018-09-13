﻿$(document).ready(function () {

    var agendamentos = [];
    var agendamentoSelecionado = null;
    UpdateAgenda();

    function UpdateAgenda() {
        agendamentos = [];
        $.ajax({
            type: "GET",
            url: "/Agendamentos/GetAgendamentos",
            success: function (data) {
                $.each(data, function (i, a) {
                    agendamentos.push({
                        agendamentoId: a.Id,
                        start: moment(a.DataHoraInicio),
                        end: moment(a.DataHoraFinal),
                        funcionarioId: a.FuncionarioId,
                        clienteId: a.ClienteId,
                        situacao: a.Situacao,
                        cliente: a.Cliente,
                        funcionario: a.Funcionario,
                        descricao: a.Descricao,
                        servicos: a.Servicos,
                        title: " Cliente: " + a.Cliente + " | Serviços: " + a.Servicos + " [ Situação: " + a.Situacao + " ]"
                    });
                });

                GerarAgenda(agendamentos);
            },
            error: function (error) {
                new PNotify({
                    title: 'Erro:',
                    text: 'Não foi possível carregar agenda',
                    type: 'error'
                });
            }
        })
    }

    function GerarAgenda(agendamentos) {
        // Colocando data de inicio do calendário
        var date = new Date();
        date.setDate(date.getDate() - 1);

        $('#agenda').fullCalendar('destroy');
        $('#agenda').fullCalendar({

            contentHeight: 500,
            timeFormat: 'HH:mm a',
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay,agenda'
            },
            defaultView: 'agenda',
            /*scrollTime: ,*/
            allDaySlot: false,
            eventLimit: true,
            validRange: {
                start: date
            },

            eventTextColor: 'white',
            eventColor: '#000',
            events: agendamentos,
            eventClick: function (Agendamento, jsEvent, view) {
                agendamentoSelecionado = Agendamento;
                $('#agendamento-modal #eventTitle').text(Agendamento.cliente);

                var $description = $('<div/>');
                $description.append($('<p/>').html('<b>Horário Inicial: </b>' + Agendamento.start.format("DD/MMM/YYYY HH:mm a")));

                $description.append($('<p/>').html('<b>Horário Final: </b>' + Agendamento.end.format("DD/MMM/YYYY HH:mm a")));

                $description.append($('<p/>').html('<b>Cliente: </b>' + Agendamento.cliente));
                $description.append($('<p/>').html('<b>Funcionário: </b>' + Agendamento.funcionario));
                $description.append($('<p/>').html('<b>Serviços: </b>' + Agendamento.servicos));
                $description.append($('<p/>').html('<b>Descrição: </b>' + Agendamento.descricao));
                $description.append($('<p/>').html('<b>Situação: </b>' + Agendamento.situacao));
                $('#agendamento-modal #pDetails').empty().html($description);

                $('#agendamento-modal').modal();
            },
            selectable: true,
            select: function (start, end, agendamento) {
                agendamentoSelecionado = {
                    agendamentoId: 0,
                    start: start,
                    end: end,
                    situacao: agendamento.situacao,
                    descricao: agendamento.descricao
                };
                frmEditarAgendamento();
                $('#agenda').fullCalendar('unselect');
            },
            editable: true,
            eventDrop: function (agendamento) {
                var data = {
                    Id: agendamento.agendamentoId,
                    DataHoraInicio: agendamento.start.format('DD/MM/YYYY HH:mm A'),
                    DataHoraFinal: agendamento.end.format('DD/MM/YYYY HH:mm A'),
                    Situacao: agendamento.situacao,
                    FuncionarioId: agendamento.funcionarioId,
                    ClienteId: agendamento.clienteId,
                    Descricao: agendamento.descricao
                };
                SalvarAgendamento(data);
            },
            eventResize: function (agendamento) {
                var data = {
                    Id: agendamento.agendamentoId,
                    DataHoraInicio: agendamento.start.format('DD/MM/YYYY HH:mm A'),
                    DataHoraFinal: agendamento.end.format('DD/MM/YYYY HH:mm A'),
                    Situacao: agendamento.situacao,
                    FuncionarioId: agendamento.funcionarioId,
                    ClienteId: agendamento.clienteId,
                    Descricao: agendamento.descricao
                };
                SalvarAgendamento(data);
            }
        });
    }

    $('#btnEditar').click(function () {
        //Open modal dialog for edit event
        frmEditarAgendamento();
    });

    $('#btnDeletar').click(function () {
        if (agendamentoSelecionado != null && confirm('Deseja realmente deletar esse registro?')) {
            $.ajax({
                type: "POST",
                url: '/Agendamentos/Deletar',
                data: { 'Id': agendamentoSelecionado.agendamentoId },
                success: function (data) {
                    if (data.status) {
                        //Refresh the calender
                        new PNotify({ text: 'Registro removido!', type: 'success', delay: 500 });
                        UpdateAgenda();
                        $('#agendamento-modal').modal('hide');
                    }
                },
                error: function () {
                    new PNotify({
                        title: 'Erro:',
                        text: 'Não foi possível remover o agendamento',
                        type: 'error'
                    });
                }
            });
        }
    });

    $('#dtDataHoraInicio, #dtDataHoraFinal').datetimepicker({
        format: 'DD/MM/YYYY HH:mm A',
        locale: 'pt-br',
        minDate: new Date()
    });


    function frmEditarAgendamento() {
        if (agendamentoSelecionado != null) {

            $('#Id').val(agendamentoSelecionado.agendamentoId);
            $('#FuncionarioId').val(agendamentoSelecionado.funcionario).change();
            $('#ClienteId').val(agendamentoSelecionado.cliente).change();
            $('#DataHoraInicio').val(agendamentoSelecionado.start.format('DD/MM/YYYY HH:mm A'));
            $('#DataHoraFinal').val(agendamentoSelecionado.end.format('DD/MM/YYYY HH:mm A'));
            $("#Situacao").val(agendamentoSelecionado.situacao).change();
            $("#Descricao").val(agendamentoSelecionado.descricao);
            $("#selectServicos").val(agendamentoSelecionado.servicos[0], agendamentoSelecionado.servicos[1]).change();
            //$('#selectServicos').val(agendamentoSelecionado.descricao);
        }
        $('#agendamento-modal').modal('hide');
        $('#agendamento-modal-salvar').modal();
    }

    $('#btnSalvarAgendamento').click(function () {
        debugger;
        //Validation/
        if ($('#DataHoraInicio').val().trim() == "") {
            new PNotify('Horário de inicio deve ser preenchido!');
            return;
        }
        if ($('#DataHoraFinal').val().trim() == "") {
            new PNotify('Horário de finalização deve ser preenchido!');
            return;
        }
        if ($('#FuncionarioId').val() == null) {
            new PNotify('Selecione um Funcionário!');
            return;
        }
        if ($('#ClienteId').val() == null) {
            new PNotify('Selecione um Cliente!');
            return;
        }

        if ($('#selectServicos').val() == null) {
            new PNotify('Selecione um Serviço!');
            return;
        }
        //else {
        var hrInicio = moment($('#DataHoraInicio').val(), "DD/MM/YYYY HH:mm A").toDate();
        var hrFinal = moment($('#DataHoraFinal').val(), "DD/MM/YYYY HH:mm A").toDate();
        if (hrInicio > hrFinal) {
            new PNotify({
                title: 'Horários Inválidos',
                text: 'Data e Horário de finalização deve ser maior que inicial...'
            });
            return;
        }
        //}

        var data = {
            Id: $('#Id').val(),
            DataHoraInicio: $('#DataHoraInicio').val().trim(),
            DataHoraFinal: $('#DataHoraFinal').val().trim(),
            Situacao: $('#Situacao').val(),
            FuncionarioId: $('#FuncionarioId').val(),
            ClienteId: $('#ClienteId').val(),
            Descricao: $('#Descricao').val(),
            servicos: $('#selectServicos').val()
        }
        SalvarAgendamento(data);
        // call function for submit data to the server
    });

    function SalvarAgendamento(data) {
        debugger;
        $.ajax({
            type: "POST",
            url: '/Agendamentos/Salvar',
            data: data,
            success: function (data) {

                new PNotify({
                    delay: 500,
                    text: 'Agendamento Realizado!',
                    type: 'success'
                });
                UpdateAgenda();
                $('#agendamento-modal-salvar').modal('hide');
            },
            error: function () {
                new PNotify({
                    title: 'Erro:',
                    text: 'Não foi possível realizar o agendamento. Verifique se os campos foram preenchidos corretamente...',
                    type: 'error'
                });
            }
        });

        limparCampos();
    }


    $('#btnPagar').click(function () {
        //Open modal dialog for edit event
        frmPagarAgendamento();
    });

    function frmPagarAgendamento() {
        if (agendamentoSelecionado != null) {

            if (agendamentoSelecionado.situacao == "Pago") {
                $('#agendamento-modal').modal('hide');

                new PNotify('Esse agendamento já foi Pago!');
            } else {
                var id = agendamentoSelecionado.agendamentoId;
                window.location.replace("/Caixa/Pagamento?id=" + id);
            }
        }
    }

    $("#selectServicos").select2({
        width: "100%",
        ajax: {
            url: "/Servicos/GetServicos",
            dataType: 'json',
            type: "GET",
            data: function (params) {

                var queryParameters = {
                    term: params.term
                }
                return queryParameters;
            },
            processResults: function (data) {
                // Tranforms the top-level key of the response object from 'items' to 'results'
                return {
                    results: data.items
                };
            }
        }
    });

    $("#ClienteId").select2({
        width: "100%",
        ajax: {
            url: "/Cliente/GetClientes",
            dataType: 'json',
            type: "GET",
            data: function (params) {

                var queryParameters = {
                    term: params.term
                }
                return queryParameters;
            },
            processResults: function (data) {
                // Tranforms the top-level key of the response object from 'items' to 'results'
                return {
                    results: data.items
                };
            }
        }
    });

    $("#FuncionarioId").select2({
        width: "100%",
        ajax: {
            url: "/Funcionarios/GetFuncionarios",
            dataType: 'json',
            type: "GET",
            data: function (params) {

                var queryParameters = {
                    term: params.term
                }
                return queryParameters;
            },
            processResults: function (data) {
                // Tranforms the top-level key of the response object from 'items' to 'results'
                return {
                    results: data.items
                };
            }
        }
    });

    //function limparCampos() {
    //    $('#Id').val("");
    //    $('#DataHoraInicio').val("");
    //    $('#DataHoraFinal').val("");
    //    $("#Situacao").val("");
    //    $("#selectServicos").val("");
    //    $('#FuncionarioId').val("");
    //    $('#ClienteId').val("");
    //}
});