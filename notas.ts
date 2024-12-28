/*
SELECT * FROM pago limit 10;

pago_id, pago_colegiado, pago_fecha, pago_monto_total, pago_nro_boletaventa, pago_recibo, pago_notas, pago_aporte, pago_otros,
pago_usu_create, pago_fecha_create, pago_usu_update, pago_fecha_update
;

SELECT * FROM aportaciones limit 10;

aport_id, aport_colegiado, aport_pago, aport_periodo, aport_mes, aport_monto, aport_fecha,
aport_usu_create, aport_fecha_create, aport_usu_update, aport_fecha_update
;

SELECT * FROM pago_otros limit 10;

pago_o_id, pago_o_pago, pago_o_concepto, pago_o_desc, pago_o_importe,
pago_o_usu_create, pago_o_fecha_create, pago_o_usu_update, pago_o_fecha_update

*/

export interface Pagos {
    aportaciones: Aportacione[];
    pago_otros:   PagoOtro[];
}

export interface Aportacione {
    pago_id:        number;
    pago_colegiado: number;
    anio:           string;
    periodo:        number;
    aporta_mes:     AportaMe[];
}

export interface AportaMe {
    aport_id:       null;
    aport_mes:      number;
    aport_mes_desc: string;
    aport_monto:    number;
}

export interface PagoOtro {
    pago_o_id:       number;
    pago_o_concepto: number;
    pago_o_desc:     string;
    pago_o_importe:  number;
}


const aportaciones: Aportacione[] = [
	{
		pago_id: 1,
		pago_colegiado: 100,
		anio: "2024",
		periodo: 1,
		aporta_mes: [
			{
				aport_id: null,
				aport_mes: 1,
				aport_mes_desc: "Enero",
				aport_monto: 20,
			},
			{
				aport_id: null,
				aport_mes: 2,
				aport_mes_desc: "Febrero",
				aport_monto: 20,
			},
			{
				aport_id: null,
				aport_mes: 3,
				aport_mes_desc: "Marzo",
				aport_monto: 20,
			},
			{
				aport_id: null,
				aport_mes: 4,
				aport_mes_desc: "Abril",
				aport_monto: 20,
			},
			{
				aport_id: null,
				aport_mes: 5,
				aport_mes_desc: "Mayo",
				aport_monto: 20,
			},
			{
				aport_id: null,
				aport_mes: 6,
				aport_mes_desc: "Junio",
				aport_monto: 20,
			},
			{
				aport_id: null,
				aport_mes: 7,
				aport_mes_desc: "Julio",
				aport_monto: 20,
			},
			{
				aport_id: null,
				aport_mes: 8,
				aport_mes_desc: "Agosto",
				aport_monto: 20,
			},
			{
				aport_id: null,
				aport_mes: 9,
				aport_mes_desc: "Septiembre",
				aport_monto: 20,
			},
			{
				aport_id: null,
				aport_mes: 10,
				aport_mes_desc: "Octubre",
				aport_monto: 20,
			},
			{
				aport_id: null,
				aport_mes: 11,
				aport_mes_desc: "Noviembre",
				aport_monto: 20,
			},
			{
				aport_id: null,
				aport_mes: 12,
				aport_mes_desc: "Diciembre",
				aport_monto: 20,
			},
		],
	},
];

const pago_otros: PagoOtro[] = [
	{
		pago_o_id: 1,
		pago_o_concepto: 1,
		pago_o_desc: "Pago de inscripción",
		pago_o_importe: 100,
	},
	{
		pago_o_id: 2,
		pago_o_concepto: 2,
		pago_o_desc: "Pago de multa",
		pago_o_importe: 50,
	},
];

const json: Pagos = {
    "aportaciones": [
        {
            "pago_id": 1,
            "pago_colegiado": 100,
            "anio": "2024",
            "periodo": 1,
            "aporta_mes": [
                {
                    "aport_id": null,
                    "aport_mes": 1,
                    "aport_mes_desc": "Enero",
                    "aport_monto": 20
                },
                {
                    "aport_id": null,
                    "aport_mes": 2,
                    "aport_mes_desc": "Febrero",
                    "aport_monto": 20
                },
                {
                    "aport_id": null,
                    "aport_mes": 3,
                    "aport_mes_desc": "Marzo",
                    "aport_monto": 20
                },
                {
                    "aport_id": null,
                    "aport_mes": 4,
                    "aport_mes_desc": "Abril",
                    "aport_monto": 20
                },
                {
                    "aport_id": null,
                    "aport_mes": 5,
                    "aport_mes_desc": "Mayo",
                    "aport_monto": 20
                },
                {
                    "aport_id": null,
                    "aport_mes": 6,
                    "aport_mes_desc": "Junio",
                    "aport_monto": 20
                },
                {
                    "aport_id": null,
                    "aport_mes": 7,
                    "aport_mes_desc": "Julio",
                    "aport_monto": 20
                },
                {
                    "aport_id": null,
                    "aport_mes": 8,
                    "aport_mes_desc": "Agosto",
                    "aport_monto": 20
                },
                {
                    "aport_id": null,
                    "aport_mes": 9,
                    "aport_mes_desc": "Septiembre",
                    "aport_monto": 20
                },
                {
                    "aport_id": null,
                    "aport_mes": 10,
                    "aport_mes_desc": "Octubre",
                    "aport_monto": 20
                },
                {
                    "aport_id": null,
                    "aport_mes": 11,
                    "aport_mes_desc": "Noviembre",
                    "aport_monto": 20
                },
                {
                    "aport_id": null,
                    "aport_mes": 12,
                    "aport_mes_desc": "Diciembre",
                    "aport_monto": 20
                }
            ]
        }
    ],
    "pago_otros": [
        {
            "pago_o_id": 1,
            "pago_o_concepto": 1,
            "pago_o_desc": "Pago de inscripción",
            "pago_o_importe": 100
        },
        {
            "pago_o_id": 2,
            "pago_o_concepto": 2,
            "pago_o_desc": "Pago de multa",
            "pago_o_importe": 50
        }
    ]
}


console.log(json, aportaciones, pago_otros);