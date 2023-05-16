package cc.introspection.fs.controller;

import cc.introspection.fs.entity.Directory;
import cc.introspection.fs.entity.File;
import cc.introspection.fs.entity.SuccessMessage;
import cc.introspection.fs.exception.DirectoryNotFoundException;
import cc.introspection.fs.repository.DirectoryRepository;
import cc.introspection.fs.repository.FileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/directories")
    public Directory add(@RequestBody Directory directory) {
        return repository.save(directory);
    }

    @PutMapping("/directories/{id}")
    public ResponseEntity<SuccessMessage> update(@PathVariable Long id, @RequestBody Directory directory) {
        return repository.findById(id)
                .map(d -> {
                    d.setName(directory.getName());
                    d.setParentId(directory.getParentId());
                    repository.save(d);
                    return ResponseEntity.ok(new SuccessMessage(true, "Directory saved"));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new SuccessMessage(false, "Directory not found")));
    }

    @DeleteMapping("/directories/{id}")
    public ResponseEntity<SuccessMessage> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            List<File> files = fileRepository.findByParentId(id);
            for (File file : files) {
                fileRepository.deleteById(file.getId());
            }
            repository.deleteById(id);
            return ResponseEntity.ok(new SuccessMessage(true, "Directory deleted"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new SuccessMessage(false, "Directory not found"));
        }
    }
}
