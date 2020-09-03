import { ItemPedidoDTO } from "./item-pedido.dto";
import { PagamentoDTO } from "./pagamento.dto";
import { RefDTO } from "./ret.dto";
export interface PedidoDTO {
  cliente: RefDTO;
  endereco: RefDTO;
  pagamento: PagamentoDTO;
  items: ItemPedidoDTO[];
}
