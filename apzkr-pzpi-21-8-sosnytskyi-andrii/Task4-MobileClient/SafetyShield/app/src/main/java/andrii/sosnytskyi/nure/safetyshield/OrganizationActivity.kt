package andrii.sosnytskyi.nure.safetyshield

import andrii.sosnytskyi.nure.safetyshield.adapters.OrganizationAdapter
import andrii.sosnytskyi.nure.safetyshield.viewmodel.MainViewModel
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import java.util.Collections.emptyList

class OrganizationActivity : AppCompatActivity() {
    private lateinit var viewModel: MainViewModel
    private lateinit var organizationAdapter: OrganizationAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_organization)

        // Инициализируем ViewModel
        viewModel = ViewModelProvider(this).get(MainViewModel::class.java)

        val recyclerView: RecyclerView = findViewById(R.id.organizationRecyclerView)
        recyclerView.layoutManager = GridLayoutManager(this, 2) // Устанавливаем GridLayoutManager с 2 колонками
        organizationAdapter = OrganizationAdapter(emptyList())
        recyclerView.adapter = organizationAdapter

        // Вызываем метод для получения организаций
        viewModel.fetchOrganizations()

        // Наблюдаем за списком организаций
        viewModel.organizations.observe(this, Observer { organizations ->
            organizations?.let {
                organizationAdapter.updateData(it)
            }
        })
    }
}
