package cc.introspection.fs;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DirectoryController {

    private final DirectoryRepository repository;

    public DirectoryController(DirectoryRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/directories")
    public List<Directory> all() {
        return repository.findAll();
    }

    @GetMapping("/directories/{id}")
    public Directory single(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new DirectoryNotFoundException(id));
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
