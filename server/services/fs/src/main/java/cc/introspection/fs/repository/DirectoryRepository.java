package cc.introspection.fs.repository;

import cc.introspection.fs.entity.Directory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DirectoryRepository extends JpaRepository<Directory, Long> {

}
