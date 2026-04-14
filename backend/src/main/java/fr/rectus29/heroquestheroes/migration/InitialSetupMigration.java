package fr.rectus29.heroquestheroes.migration;

import fr.rectus29.heroquestheroes.model.Hero;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;

//@ChangeUnit(id = "001-initial-hero-index", order = "001", author = "rectus29")
public class InitialSetupMigration {

    @Execution
    public void execution(MongoTemplate mongoTemplate) {
        mongoTemplate.indexOps(Hero.HEROES)
                .ensureIndex(new Index("name", Sort.Direction.ASC)
                        .unique()
                        .named("idx_hero_name_unique"));
    }

    @RollbackExecution
    public void rollbackExecution(MongoTemplate mongoTemplate) {
        mongoTemplate.indexOps(Hero.HEROES).dropIndex("idx_hero_name_unique");
    }
}