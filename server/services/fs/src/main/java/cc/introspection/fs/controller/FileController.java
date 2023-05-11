package cc.introspection.fs.controller;

import cc.introspection.fs.exception.FileNotFoundException;
import cc.introspection.fs.repository.FileRepository;
import cc.introspection.fs.entity.File;
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
    public File update(@PathVariable Long id, @RequestBody File file) {
        return repository.findById(id)
                .map(f -> {
                    f.setName(file.getName());
                    f.setContent(file.getContent());
                    f.setType(file.getType());
                    return repository.save(f);
                })
                .orElseGet(() -> {
                    file.setId(id);
                    return repository.save(file);
                });
    }

    @DeleteMapping("/files/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
