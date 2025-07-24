package fr.rectus29.heroquestheroes;

import com.mongodb.client.MongoClient;
import fr.rectus29.heroquestheroes.model.Hero;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.stereotype.Component;

@Component
public class dbInit {

    @Autowired protected MongoTemplate mongoTemplate;

    @PostConstruct
    public void initIndex(){
        mongoTemplate
                .indexOps(Hero.HEROES)
                .ensureIndex(new Index("name", Sort.Direction.ASC)
                .unique());
    }
}
