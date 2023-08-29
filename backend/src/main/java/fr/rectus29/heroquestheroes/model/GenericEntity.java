package fr.rectus29.heroquestheroes.model;

import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.Instant;

@Getter
@Setter
public class GenericEntity {
   @Id
   private ObjectId id = ObjectId.get();
   @CreatedDate
   private Instant creationInstant = Instant.now();
   @LastModifiedDate
   private Instant updateInstant;
}
