export enum StatusDespensa {
    EM_FALTA = 'EM_FALTA',
    EM_ESTOQUE = 'EM_ESTOQUE',
}

export enum PapelMembroCasa {
    ADMIN = 'ADMIN',
    MEMBRO = 'MEMBRO',
}

export enum StatusMembroCasa {
    PENDENTE = 'PENDENTE',
    ACEITO = 'ACEITO',
    REJEITADO = 'REJEITADO',
    DONO = 'DONO',
}

export enum StatusItemDespensa {
    DISPONIVEL = 'DISPONIVEL',
    QUASE_ACABANDO = 'QUASE_ACABANDO',
    VENCIDO = 'VENCIDO',
    VENCENDO = 'VENCENDO',
    SEM_ESTOQUE = 'SEM_ESTOQUE',
}

export enum StatusListaCompra {
    ATIVA = 'ATIVA',
    CONCLUIDA = 'CONCLUIDA',
    CANCELADA = 'CANCELADA',
}

export enum PrioridadeListaCompra {
    BAIXA = 'BAIXA',
    MEDIA = 'MEDIA',
    ALTA = 'ALTA',
}
