# app/services/module_service.py
from typing import List
from uuid import uuid4
from sqlmodel import Session, select
from app.models.Module import Module

from app.schemas.Module import ModuleCreate, ModuleRead

class ModuleService:
    def __init__(self, session: Session):
        self.session = session
        
    def all(self) -> List[ModuleRead]:
        stmt = select(Module)
        modules = self.session.exec(stmt).all()
        return [
            ModuleRead(
                id=m.id,
                title=m.title,
                duration_hours=m.duration_hours,
                description=m.description,
                order_index=m.order_index
            )
            for m in modules
        ]

    def get(self, module_id: str) -> ModuleRead | None:
        module = self.session.get(Module, module_id)
        if not module:
            return None
        return ModuleRead(
            id=module.id,
            title=module.title,
            duration_hours=module.duration_hours,
            description=module.description,
            order_index=module.order_index
        )

    def create_modules_for_formation(self, formation_id: str, modules_data: List[ModuleCreate]) -> List[Module]:
        """
        Crée tous les modules associés à une formation
        """
        modules: List[Module] = []
        for m in modules_data:
            module_obj = Module(
                id=str(uuid4()),
                formation_id=formation_id,
                title=m.title,
                duration_hours=m.duration_hours,
                description=m.description,
                order_index=m.order_index or 0
            )
            self.session.add(module_obj)
            modules.append(module_obj)

        return modules
    
    def all_by_formation(self, formation_id: str) -> List[ModuleRead]:
        stmt = select(Module).where(Module.formation_id == formation_id)
        modules = self.session.exec(stmt).all()
        return [
            ModuleRead(
                id=m.id,
                title=m.title,
                duration_hours=m.duration_hours,
                description=m.description,
                order_index=m.order_index
            )
            for m in modules
        ]
