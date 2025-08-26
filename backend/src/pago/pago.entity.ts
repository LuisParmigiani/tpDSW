import { Entity, ManyToOne, Property, Rel, Enum } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Turno } from '../turno/turno.entity.js';

// Enum para estados de MercadoPago
export enum EstadoPago {
  PENDING = 'pending', // Pendiente
  APPROVED = 'approved', // Aprobado
  AUTHORIZED = 'authorized', // Autorizado
  IN_PROCESS = 'in_process', // En proceso
  IN_MEDIATION = 'in_mediation', // En mediación
  REJECTED = 'rejected', // Rechazado
  CANCELLED = 'cancelled', // Cancelado
  REFUNDED = 'refunded', // Reembolsado
  CHARGED_BACK = 'charged_back', // Contracargo
}

@Entity()
export class Pago extends BaseEntity {
  @Property({ nullable: false })
  fechaHora!: Date;

  @Property({ nullable: false, unique: true })
  idMercadoPago!: string;

  @Property({ nullable: true }) // Puede ser null inicialmente
  idPreferencia?: string; // ID de la preferencia de MP

  @Property({ nullable: false })
  descripcionPago!: string;

  @Property({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  monto!: number;

  @Enum(() => EstadoPago)
  estado!: EstadoPago;

  @Property({ nullable: true }) // Detalle específico del estado
  detalleEstado?: string; // status_detail de MP

  @Property({ nullable: false, default: 1 })
  cuotas!: number;

  @Property({ nullable: false, onUpdate: () => new Date() })
  fechaActualizacion!: Date;

  // Campos adicionales útiles de MercadoPago
  @Property({ nullable: true })
  metodoPago?: string; // visa, mastercard, etc.

  @Property({ nullable: true })
  tipoPago?: string; // credit_card, debit_card, etc.

  @Property({ nullable: true })
  emailPagador?: string;

  @Property({ nullable: true })
  montoNeto?: number; // Monto que recibes después de comisiones

  @Property({ nullable: true })
  fechaAprobacion?: Date; // Cuándo fue aprobado

  @Property({ type: 'json', nullable: true })
  datosCompletos?: any; // Para guardar toda la respuesta de MP

  @ManyToOne(() => Turno, { nullable: false })
  turno!: Rel<Turno>;
}
