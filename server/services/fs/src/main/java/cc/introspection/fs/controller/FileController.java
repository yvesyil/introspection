package cc.introspection.fs.controller;

import cc.introspection.fs.entity.SuccessMessage;
import cc.introspection.fs.exception.FileNotFoundException;
import cc.introspection.fs.repository.FileRepository;
import cc.introspection.fs.entity.File;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FileController {

    private final FileRepository repository;

    public FileController(FileRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/files")
    public List<File> all() {
        return repository.findAll();
    }

    @GetMapping("/files/{id}")
    public File single(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new FileNotFoundException(id));
    }

    @PostMapping("/files")
    public File add(@RequestBody File file) {
        return repository.save(file);
    }

    @PutMapping("/files/{id}")
    public ResponseEntity<SuccessMessage> update(@PathVariable Long id, @RequestBody File file) {
        return repository.findById(id)
                .map(f -> {
                    f.setName(file.getName());
                    f.setContent(file.getContent());
                    f.setType(file.getType());
                    repository.save(f);
                    return ResponseEntity.ok(new SuccessMessage(true, "File saved"));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new SuccessMessage(false, "File not found")));
    }

    @DeleteMapping("/files/{id}")
    public ResponseEntity<SuccessMessage> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok(new SuccessMessage(true, "File deleted"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new SuccessMessage(false, "File not found"));
        }
    }
}
