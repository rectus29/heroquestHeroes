package fr.rectus29.heroquestheroes;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.bson.types.ObjectId;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import java.io.IOException;

@Configuration
@Import(JacksonAutoConfiguration.class)
public class JacksonMapperConfiguration {



  public static class ObjectIdSerializer extends JsonSerializer<ObjectId> {
    @Override
    public void serialize(
        final ObjectId object, final JsonGenerator generator, final SerializerProvider arg2)
        throws IOException {
      if (object == null) {
        generator.writeNull();
      } else {
        generator.writeString(object.toString());
      }
    }
  }


  @Bean
  public SimpleModule customSerializersModule() {
    final SimpleModule module = new SimpleModule("HQHeroesCustomSerializers");
    module.addSerializer(ObjectId.class, new ObjectIdSerializer());
    return module;
  }

  @Bean
  public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
    return builder ->
        builder
            .serializationInclusion(Include.NON_NULL)
            .featuresToDisable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
  }
}
