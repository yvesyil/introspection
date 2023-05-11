package cc.introspection.fs;

import cc.introspection.fs.entity.Directory;
import cc.introspection.fs.entity.File;
import cc.introspection.fs.repository.DirectoryRepository;
import cc.introspection.fs.repository.FileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoadDatabase {

    private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

    @Bean
    CommandLineRunner initDatabase(DirectoryRepository directoryRepository, FileRepository fileRepository) {
        return args -> {
            log.info("Preloading database with default entries...");
            directoryRepository.save(new Directory(1L, "root", true, null));
            directoryRepository.save(new Directory(1L, "test", false, 1L));
            fileRepository.save(new File(1L, "main.c", "c-src", "// paste your code here\n" +
                    "#include <stdio.h>\n" +
                    "\n" +
                    "int main(void)\n" +
                    "{\n" +
                    "    printf(\"Hello, World!\");\n" +
                    "    return 0;\n" +
                    "}", 1L));
            fileRepository.save(new File(1L, "temp.txt", "text", "Lorem ipsum dolor sit amet.", 2L));
        };
    }
}
