package fr.rectus29.heroquestheroes;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Slf4j
@SpringBootApplication
@EnableMongoRepositories(basePackages = "fr.rectus29")
public class HeroquestHeroesApplication {
    public static void main(String[] args) {
        SpringApplication.run(HeroquestHeroesApplication.class, args);
    }

}
