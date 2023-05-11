package cc.introspection.fs.repository;

import cc.introspection.fs.entity.Directory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DirectoryRepository extends JpaRepository<Directory, Long> {

    @Query("SELECT d FROM Directory d WHERE d.parentId = :parentId")
    public List<Directory> findByParentId(Long parentId);

    @Query("SELECT d FROM Directory d WHERE d.root = :root")
    public List<Directory> findByRoot(Boolean root);

    @Query("SELECT d FROM Directory d WHERE d.userId = :userId")
    public List<Directory> findByUserId(Long userId);

    public List<Directory> findByRootAndUserId(Boolean root, Long userId);
}
