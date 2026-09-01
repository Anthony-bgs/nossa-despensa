import { Controller, UseFilters } from "@nestjs/common";
import { HttpExceptionFilter } from "../filters/http-exception.filter";

@Controller('membros-casa')
@UseFilters(new HttpExceptionFilter())
export class MembroCasaController {}