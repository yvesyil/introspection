package cc.introspection.fs.repository;

import cc.introspection.fs.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {

    @Query("SELECT f FROM File f WHERE f.parentId = :parentId")
    public List<File> findByParentId(Long parentId);
}
