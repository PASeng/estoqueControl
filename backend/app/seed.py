from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Bag, BagItem, ClosingReport, Product, Seller


def seed_data(db: Session) -> None:
    if db.execute(select(Product.id)).first():
        return

    sellers = [
        Seller(
            name="Camila Duarte",
            cpf="12345678901",
            phone="(11) 98765-1201",
            region="Zona Norte",
            address="Rua das Oliveiras, 120",
            gps_point="-23.482, -46.621",
        ),
        Seller(
            name="Bianca Lopes",
            cpf="12345678902",
            phone="(11) 98814-3344",
            region="Zona Sul",
            address="Av. República, 450",
            gps_point="-23.563, -46.654",
        ),
        Seller(
            name="Juliana Reis",
            cpf="12345678903",
            phone="(11) 97987-5520",
            region="Centro",
            address="Rua do Comércio, 88",
            gps_point="-23.548, -46.636",
        ),
        Seller(
            name="Renata Alves",
            cpf="12345678904",
            phone="(11) 98541-0092",
            region="Zona Oeste",
            address="Rua Guaicurus, 901",
            gps_point="-23.526, -46.697",
        ),
        Seller(
            name="Fernanda Dias",
            cpf="12345678905",
            phone="(11) 99411-7782",
            region="Zona Leste",
            address="Av. Radial Leste, 3020",
            gps_point="-23.544, -46.564",
        ),
        Seller(
            name="Larissa Monteiro",
            cpf="12345678906",
            phone="(11) 99612-7701",
            region="Zona Norte",
            address="Rua Campo Belo, 14",
            gps_point="-23.475, -46.633",
        ),
        Seller(
            name="Patricia Souza",
            cpf="12345678907",
            phone="(11) 99098-1100",
            region="Centro",
            address="Rua 7 de Abril, 19",
            gps_point="-23.545, -46.638",
        ),
        Seller(
            name="Marta Santos",
            cpf="12345678908",
            phone="(11) 98572-4420",
            region="Zona Sul",
            address="Rua Bandeira, 712",
            gps_point="-23.589, -46.669",
        ),
        Seller(
            name="Natalia Cruz",
            cpf="12345678909",
            phone="(11) 97771-0920",
            region="Zona Oeste",
            address="Rua Lapa, 331",
            gps_point="-23.514, -46.693",
        ),
        Seller(
            name="Ana Paula Lima",
            cpf="12345678910",
            phone="(11) 98220-9901",
            region="Zona Leste",
            address="Rua Aricanduva, 1700",
            gps_point="-23.566, -46.521",
        ),
    ]
    db.add_all(sellers)

    categories = ["Anéis", "Colares", "Pulseiras", "Brincos", "Pingentes"]
    materials = ["Ouro", "Prata", "Banhado"]
    products = []
    for index in range(50):
        category = categories[index % len(categories)]
        material = materials[index % len(materials)]
        product = Product(
            name=f"{category} {index + 1}",
            category=category,
            material=material,
            barcode=f"78900{index:03d}",
            price=120 + index * 7.5,
            stock_qty=20 - (index % 5),
        )
        products.append(product)
    db.add_all(products)
    db.flush()

    bag_1 = Bag(
        code="MA-001",
        status="Em campo",
        due_date=datetime.utcnow() + timedelta(days=3),
        seller=sellers[0],
    )
    bag_2 = Bag(
        code="MA-014",
        status="Aguardando",
        due_date=datetime.utcnow() + timedelta(days=5),
        seller=sellers[1],
    )
    bag_3 = Bag(
        code="MA-020",
        status="Em campo",
        due_date=datetime.utcnow() + timedelta(days=7),
        seller=sellers[4],
    )
    bag_4 = Bag(code="MA-031", status="Disponível")
    bag_5 = Bag(code="MA-032", status="Disponível")

    bag_1.items = [
        BagItem(product_id=products[0].id, quantity_sent=4, quantity_returned=1),
        BagItem(product_id=products[6].id, quantity_sent=6, quantity_returned=2),
    ]
    bag_2.items = [
        BagItem(product_id=products[12].id, quantity_sent=5, quantity_returned=0),
        BagItem(product_id=products[18].id, quantity_sent=7, quantity_returned=3),
    ]
    bag_3.items = [
        BagItem(product_id=products[24].id, quantity_sent=8, quantity_returned=4),
        BagItem(product_id=products[30].id, quantity_sent=4, quantity_returned=1),
    ]

    db.add_all([bag_1, bag_2, bag_3, bag_4, bag_5])
    db.flush()

    reports = [
        ClosingReport(
            bag_id=bag_1.id,
            sold_count=6,
            summary=(
                "Vendas concentradas em anéis banhados. Sugestão: reduzir prata na próxima maleta."
            ),
        ),
        ClosingReport(
            bag_id=bag_2.id,
            sold_count=8,
            summary=(
                "Boa saída de colares de ouro. Recomenda-se incluir mais conjuntos completos."
            ),
        ),
        ClosingReport(
            bag_id=bag_3.id,
            sold_count=4,
            summary=(
                "Baixa conversão em pulseiras. Ajustar mix para peças de maior giro."
            ),
        ),
    ]
    db.add_all(reports)
    db.commit()
