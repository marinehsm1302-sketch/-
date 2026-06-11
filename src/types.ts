export enum GoodType {
  TSHIRT = "TSHIRT",
  CAP = "CAP",
  PHONE_CASE = "PHONE_CASE",
  MUG = "MUG"
}

export interface SloganItem {
  text: string;
  sub: string;
}

export interface CustomDesign {
  goodsType: GoodType;
  baseColor: string;
  textColor: string;
  sloganText: string;
  sloganSubText: string;
  fontStyle: string;
  stickerId: string | null;
  textPosition: { x: number; y: number };
  textSize: number;
}

export interface MemeItem {
  id: string;
  title: string;
  origin: string;
  votes: number;
  tags: string[];
}

export interface CheerMessage {
  id: string;
  nickname: string;
  message: string;
  createdAt: string;
  voodooTarget?: string; // e.g. "삼성 라이온즈", "LG 트윈스"
}

export interface PodOrder {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: {
    design: CustomDesign;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: "PENDING" | "SHIPPING" | "COMPLETED";
  createdAt: string;
}
