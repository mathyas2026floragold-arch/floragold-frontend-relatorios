# Frontend FloraGold v9

Front-end para GitHub Pages, já apontando para o backend Render.

A tela usa apenas:

- data inicial
- data final
- tipo de relatório
- operador/fila/status opcionais

Não há filtro de horário na interface. O backend trata o período como dia completo.


## Ajuste v12
- Front-end sem campos de hora.
- Datas em texto `dd/mm/aaaa`, sem limite 2025/2027 e sem calendário nativo que falhava.
- Backend continua aplicando o dia inteiro internamente: 00:00 até 23:59.
