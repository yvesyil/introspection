package cc.introspection.fs.controller;

import cc.introspection.fs.entity.Directory;
import cc.introspection.fs.entity.File;
import cc.introspection.fs.exception.DirectoryNotFoundException;
import cc.introspection.fs.repository.DirectoryRepository;
import cc.introspection.fs.repository.FileRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DirectoryController {

    private final DirectoryRepository repository;
    private final FileRepository fileRepository;

    public DirectoryController(DirectoryRepository repository, FileRepository fileRepository) {
        this.repository = repository;
        this.fileRepository = fileRepository;
    }

    @GetMapping("/directories")
    public List<Directory> all(@RequestParam(name = "root", required = false) Boolean root,
                               @RequestParam(name = "userId", required = false) Long userId) {
        if (root != null && userId != null) {
            return repository.findByRootAndUserId(root, userId);
        }
        return repository.findAll();
    }

    @GetMapping("/directories/{id}")
    public Directory single(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new DirectoryNotFoundException(id));
    }

    @GetMapping("/directories/{id}/directories")
    public List<Directory> directories(@PathVariable Long id) {
        return repository.findByParentId(id);
    }

    @GetMapping("/directories/{id}/files")
    public List<File> files(@PathVariable Long id) {
        return fileRepository.findByParentId(id);
    }

    @PostMapping("/directories/{id}")
    public Directory add(@RequestBody Directory directory) {
        return repository.save(directory);
    }

    @PutMapping("/directories/{id}")
    public Directory update(@PathVariable Long id, @RequestBody Directory directory) {
        return repository.findById(id)
                .map(d -> {
                    d.setName(directory.getName());
                    d.setParentId(directory.getParentId());
                    return repository.save(d);
                })
                .orElseGet(() -> {
                    directory.setId(id);
                    return repository.save(directory);
                });
    }

    @DeleteMapping("/directories/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
