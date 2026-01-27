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

    statuses = [
        "Em campo",
        "Em campo",
        "Aguardando",
        "Em campo",
        "Aguardando",
        "Disponível",
        "Disponível",
        "Aguardando",
        "Disponível",
        "Em campo",
        "Disponível",
        "Aguardando",
        "Disponível",
        "Disponível",
        "Em campo",
    ]

    bags = []
    for index in range(15):
        status = statuses[index]
        seller = sellers[index % len(sellers)] if status == "Em campo" else None
        due_date = (
            datetime.utcnow() + timedelta(days=3 + index)
            if status in {"Em campo", "Aguardando"}
            else None
        )
        bag = Bag(
            code=f"MA-{index + 1:03d}",
            status=status,
            due_date=due_date,
            seller=seller,
        )
        bags.append(bag)

    for idx, bag in enumerate(bags[:6]):
        bag.items = [
            BagItem(
                product_id=products[idx * 2].id,
                quantity_sent=4 + idx,
                quantity_returned=1,
            ),
            BagItem(
                product_id=products[idx * 2 + 1].id,
                quantity_sent=6 + idx,
                quantity_returned=2,
            ),
        ]

    db.add_all(bags)
    db.flush()

    reports = [
        ClosingReport(
            bag_id=bags[0].id,
            sold_count=6,
            summary=(
                "Vendas concentradas em anéis banhados. Sugestão: reduzir prata na próxima maleta."
            ),
        ),
        ClosingReport(
            bag_id=bags[1].id,
            sold_count=8,
            summary=(
                "Boa saída de colares de ouro. Recomenda-se incluir mais conjuntos completos."
            ),
        ),
        ClosingReport(
            bag_id=bags[3].id,
            sold_count=4,
            summary=(
                "Baixa conversão em pulseiras. Ajustar mix para peças de maior giro."
            ),
        ),
        ClosingReport(
            bag_id=bags[9].id,
            sold_count=5,
            summary=(
                "Acessórios de prata com giro baixo. Priorizar peças banhadas na próxima remessa."
            ),
        ),
    ]
    db.add_all(reports)
    db.commit()
