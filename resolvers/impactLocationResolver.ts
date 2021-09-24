import { Resolver, Query } from 'type-graphql'
import { InjectRepository } from "typeorm-typedi-extensions";
import { ImpactLocation } from "../entities/impactLocation";
import { Repository } from "typeorm";
import {Service} from "typedi";


@Service()
@Resolver(of => ImpactLocation)
export class ImpactLocationResolver {
    constructor(
        @InjectRepository(ImpactLocation)
        private readonly impactLocationRepository: Repository<ImpactLocation>
    ) {}

    @Query(returns => [ImpactLocation], { nullable: true })
    async impactLocations(
    ): Promise<ImpactLocation[]> {
        return await this.impactLocationRepository.find();
    }
}