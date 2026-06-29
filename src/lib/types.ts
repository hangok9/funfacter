export interface Fact {
  id: number
  titulo: string
  descripcion_breve: string
  explicacion_extensa: string
  palabras: number
  tiene_fuentes: boolean
  fuentes: Fuente[]
  created_at: string
  updated_at: string
  fact_topicos?: FactTopico[]
}

export interface Fuente {
  Texto_Mostrado: string
  URL_Link?: string
}

export interface Topico {
  id: number
  nombre: string
}

export interface FactTopico {
  fact_id: number
  topico_id: number
  topicos?: Topico
}
