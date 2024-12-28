export interface PagosI {
    aportaciones?: Aportacione[];
    pago_otros?:   PagoOtro[];
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